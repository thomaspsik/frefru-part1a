import { getPool } from '../dbconnection/connect.cjs';

export const insertBatch = async (tx, producerid, deliverydate) => {
  const { rows } = await tx.query(`INSERT INTO batch (producerid, deliverydate) values ($1, $2) returning *;`, [
    producerid,
    deliverydate,
  ]);
  return rows[0];
};

export const insertBatchItem = async (tx, batchid, productid, chargeid, expiredate, units, buyprice, cbfunc) => {
  const params = [batchid, productid, chargeid, expiredate, units, buyprice];
  const { rows } = await tx.query(
    `INSERT INTO batchitem
     (batchid, productid, chargeid, expiredate, units, buyprice)
     values ($1, $2, $3, $4, $5, $6) returning *;`,
    params,
  );
  cbfunc(rows[0]); // call callback function
  return rows[0];
};

export const startTransaction = async () => {
  const client = await getPool().connect();
  await client.query('BEGIN;');
  console.log(client);
  
  return client;
};

export const commitTransaction = async (tx) => {
  await tx.query('COMMIT;');
  await tx.release();
  // done
};

export const rollbackTransaction = async (tx) => {
  await tx.query('ROLLBACK;');
  await tx.release();
  // done
};
