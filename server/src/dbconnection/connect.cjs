const { Pool } = require('pg');

let pool = null;

const getPool = () => pool;

let connectionString = 'N/A'; // for sequelize

const getConnectionString = () => connectionString;

let conObj = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

function initialisePool() {
  if (process.env.SUPABASEURL) {
    conObj = {
      connectionString: process.env.SUPABASEURL,
    };
    connectionString = process.env.SUPABASEURL;
  } else {
    const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
    connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

    conObj = {
      host: PGHOST,
      port: PGPORT,
      database: PGDATABASE,
      user: PGUSER,
      password: PGPASSWORD,
    };
  }

  // console.log(`connection String set to ${connectionString}`);

  if (!pool) {
    // console.log(`INIT Pool : ${JSON.stringify(conObj)}`);

    pool = new Pool(conObj);
    pool.frefru_getExternalConnectionString = function () {
      if (conObj.connectionString) {
        // connection by supabase connection url
        return conObj.connectionString;
      } else {
        if (process.env.mode != 'production') {
          return `postgres://${conObj.user}:${conObj.password}@${conObj.host}:${conObj.port}/${conObj.database}`;
        }
        return `postgres://${conObj.user}:##UNDISCLOSED##@${conObj.host}:${conObj.port}/${conObj.database}`;
      }
    };
  }
  return pool;
}

// WARNING POSSIBLE exposure of password

module.exports = { getPool, initialisePool, getConnectionString };
