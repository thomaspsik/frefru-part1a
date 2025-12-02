import pg from 'pg';
import { getPool } from './connect.cjs';

// workaround for dates
// https://github.com/brianc/node-postgres/issues/1844
const DATE_OID = 1082;
const parseDate = (value) => value;
// workaround for decimals
// https://medium.com/developer-rants/postgresql-node-js-and-those-damn-floating-point-values-d3a39b432b03
const NUMERIC_OID = 1700;

pg.types.setTypeParser(DATE_OID, parseDate); // map timestamps
pg.types.setTypeParser(NUMERIC_OID, (x) => Number(x));

// create pool and query object
// pool is initialized in connect.js
// export const pool = poolIn;

export const query = (text, params) => getPool().query(text, params);

// add close function for vitests
export const close = () => pool.end();
