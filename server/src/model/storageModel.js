import debug from 'debug';
import { query } from '../dbconnection/index.js';

const log = debug('storage:model');
// // eslint-disable-next-line import/prefer-default-export
// pdd product database data
export const findSlotsForSiteAndProd = async (siteid, minkg, mintemp, maxtemp, minhumidity, minquality) => {
  const params = [siteid, minkg, mintemp, maxtemp, minhumidity, minquality];
  log(params);

  const { rows } = await query(
    `select sl.slid, sa.freeunits, sa.freekg  from slot sl
        join slotavailable sa on sl.slid  = sa.slid and sa.freeunits>1 and sa.freekg > $2
        join storage s on s.storageid = sl.storageid 
        join warehouse w on w.wid = s.wid and w.siteid = $1
        where s.temperature  >= $3 and s.temperature <= $4 and s.humidity >= $5 and s.quality >= $6
        order by sl.capacityunits ;
        ;`,
    params,
  );
  return rows;
};

// part of transaction
export const insertSlotEntry = async (tx, slid, biid, unitscount) => {
  const params = [slid, biid, unitscount];
  log(params);
  const rows = await tx.query(`INSERT INTO slotentry(slid, biid, unitscount) VALUES ($1, $2, $3) returning *;`,params);
  return rows[0];
};

