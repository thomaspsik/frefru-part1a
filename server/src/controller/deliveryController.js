import fs from 'fs';
import path from 'path';
import debug from 'debug';
import asyncHandler from 'express-async-handler';
import * as model from '../model/deliveryModel.js';
import * as producerModel from '../model/producerModel.js';
import * as productModel from '../model/productModel.js';
import * as storeModel from '../model/storageModel.js';

const __dirname = process.cwd();
const log = debug('delivery:contr');

export const postDelivery = asyncHandler(async (req, res) => {
  // data in body
  let { data } = req.body;

  // try to get data from a testfiles array
  const { testfiles } = req.body;
  if (testfiles) {
    // const resultProms = [];
    // error handling is not working - so do sync proccessing.. thats bad
    // for (const tf of testfiles) {
    //   data = readFile(tf);
    //   resultProms.push(doData(data, tf, req, res));
    // }
    // const resProms = await Promise.allSettled(resultProms);
    // const results = [];
    // for (const rp of resProms) {
    //   if (rp.status == 'fulfilled') {
    //     results.push({ status: rp.value.status, data: rp.value.data });
    //   } else {
    //     // exception handling generic 400 error
    //     results.push({ status: 400, data: rp });
    //   }
    // }
    // log(results.map((r) => r.status));
    // const status = Math.max(...results.map((r) => r.status));

    const resultsSync = [];
    for (const tf of testfiles) {
      data = readFile(tf);
      resultsSync.push(await doData(data, tf, req, res));
    }
    log(resultsSync.map((r) => r.status));
    const status = Math.max(...resultsSync.map((r) => r.status));

    log(`Status: ${status}`);

    if (status >= 400) {
      // error handling

      for (const r of resultsSync) {
        if (r.status >= 400) {
          log(`Source: ${r.data.source} => Errorcode ${r.status}`);
        }
      }
    }

    res.status(status).json(resultsSync);
    return;
  }

  // try to get data from a testfile
  let { testfile } = req.body;
  if (testfile) {
    data = readFile(testfile);
  } else {
    testfile = 'from body'; // if data was specified directly in the body
  }

  // doData ... or not if missing
  const result = await doData(data, testfile, req, res);
  res.status(result.status).json(result.data);
});

function readFile(filename) {
  const readPath = path.join(__dirname, 'test', filename);
  log(`Reading from file [${readPath}]`);
  // file based import for testing mainly
  let content;
  try {
    content = fs.readFileSync(readPath);
  } catch (e) {
    res.status(408).send(e);
  }
  return JSON.parse(content.toString());
}

export const doData = asyncHandler(async (data, source, req, res) => {
  if (!data) {
    return { status: 408, data: { source, error: 'No data content available. Please check REST API call.' } };
  }
  // data has producer name, delivery date
  // and a list of items

  // first step - check input
  const prod = await producerModel.getByName(data.producer);

  if (!prod) {
    return { status: 409, data: { source, error: `Producer with name [${data.producer}] not found.` } };
  }

  let delivery = { ...data };
  delivery.producerdb = prod;

  // check items
  let errors = [];
  let hasErrors = false;
  for (const didx in data.items) {
    const di = data.items[didx];
    const checkResult = await checkDeliveryItem(di, didx);
    if (!checkResult.ok) {
      errors.push(checkResult);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    return { status: 409, data: { source, error: errors } };
  }

  // store delivery
  let store = await findStorageFor(delivery);

  if (!store.ok) {
    log(`Could not find storage for ${store.numItems} items.`);
    return { status: 410, data: {source, data: store.errors} };
  }

  log(`Found storage for ${store.numItems} items`);

  // if preview just abort
  if (req.query.preview) {
    return { status: 201, data: {source,  data: store} };
  }

  // do it for real
  // !!! TODO !!!
  // WARNING: Does not do retries, if it did not work out - it will just fail.
  // store in batch / batchitem -> set biid to batchitem
  // lookup biid from charge to set slotentry.
  // this is not the best way to handle transactions with commit and rollback
  // but it is simple.
  let result = {};
  // dummy query if transaction does not work
  let tx = {
    query: function (str) {
      console.error(`Uninitialised query ${str} no SQL performed.`);
    },
  };

  try {
    // store batch
    tx = await model.startTransaction(); // transaction client
    // store in batch / batchitem -> set biid to batchitem
    await storeBatch(tx, store, result);
    // add batchitems
    await storeBatchItems(tx, store, result);
    // store in slotentry
    await performStore(tx, store, result);

    await model.commitTransaction(tx); // and release
    // await model.rollbackTransaction(tx); // and release
  } catch (e) {
    console.error('!!!! Could not store delivery !!!!');
    console.error(e);

    await model.rollbackTransaction(tx); // and release

    return { status: 422, data: {source, data: e} };
  }

  return { status: 200, data: {source, data:result} };
});

async function storeBatch(tx, store, result) {
  result.batchdb = await model.insertBatch(tx, store.producerdb.producerid, store.deliverydate);
}

async function storeBatchItems(tx, store, result) {
  const batchid = result.batchdb.batchid;
  const proms = []; // collect all promises
  for (const bi of store.items) {
    proms.push(
      model.insertBatchItem(
        tx,
        batchid,
        bi.dbdata.productid,
        bi.charge,
        bi.expiredate,
        bi.units,
        bi.buyprice,
        (res) => {
          bi.biid = res.biid; // set biid to store.item
        },
      ),
    );
  }
  result.batchitemsdb = await Promise.all(proms); // wait for all promises
}

async function performStore(tx, store, result) {
  // find charge -> biid
  const proms = []; // collect all promises
  for (const rs of store.reservedSlots) {
    const chargeid = rs.charge;
    const bi = result.batchitemsdb.find((bi) => bi.chargeid == chargeid); // could do db lookup - but that is slower + more expensive
    if (!bi) {
      console.error(`!!! Could not find biid from chargeid ${chargeid}!!!`);
      console.error(`${result.batchitemsdb}`);
      continue;
    }
    // (slid, biid, unitscount)
    proms.push(storeModel.insertSlotEntry(tx, rs.slid, bi.biid, rs.unitscount));
  }
  result.slotentries = await Promise.all(proms);
  // remove unnecessary infos.
  delete result.batchitemsdb;
  delete result.batchdb;
}

async function checkDeliveryItem(deItem, didx) {
  const pdata = await productModel.getProductDetailByName(deItem.label);

  if (!pdata) {
    return { ok: false, message: `item with name [${deItem.label}] index:${didx} not found.` };
  }
  log(pdata);
  deItem.dbdata = pdata;
  return { ok: true };
}

async function findStorageFor(delivery) {
  const storage = { ...delivery };
  storage.numItems = delivery.items.length;
  const reservedSlots = [];
  storage.ok = true;
  storage.errors = [];
  for (const item of storage.items) {
    const slotsForItem = await findSlotsForItem(storage.site, item);
    if (slotsForItem.length < 1) {
      storage.ok = false;
      storage.errors.push({ ok: false, message: `Could not find slot for ${JSON.stringify(item)}.` });
    }
    reservedSlots.push(...slotsForItem);
  }
  storage.reservedSlots = reservedSlots;
  storage.numReservedSlots = reservedSlots.length;
  return storage;
}

async function findSlotsForItem(site, item) {
  let units = item.units;
  const reservedSlots = [];
  // siteid, mintemp, maxtemp, minkg, minhumidity, minquality;

  const slots = await storeModel.findSlotsForSiteAndProd(
    site,
    item.dbdata.kgperunit,
    item.dbdata.mintemp,
    item.dbdata.maxtemp,
    item.dbdata.minhumidity,
    item.dbdata.minquality,
  );
  log(slots);
  if (slots.length < 1) {
    return reservedSlots;
  }
  while (units > 0) {
    const useSlot = slots.shift();
    if (!useSlot) {
      return [];
    }
    useSlot.charge = item.charge;
    // either use all freeunits or just the units that are left
    const usedUnits = Math.min(units, useSlot.freeunits);
    useSlot.unitscount = usedUnits;
    // calc remaining units
    units -= usedUnits;
    reservedSlots.push(useSlot);
  }
  return reservedSlots;
}
