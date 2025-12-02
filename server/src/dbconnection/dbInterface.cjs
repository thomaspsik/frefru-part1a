const connect = require('./connect.cjs');
// const debug = require('debug')('server:db');
const serverStatus = require('../model/serverStatus.cjs');
const frefru_DB_VERSION = require('./dbversion.cjs');

let pool = null;

// getter for connection string
const getConnectionString = () => connect.getConnectionString();

async function checkDBReady() {
  pool = await connect.initialisePool();
  // console.log(pool);

  return new Promise(async function (resolve, reject) {
    if ((await ready()) == true) {
      serverStatus.addInfoStatus({
        system: 'database',
        status: 'connected',
        url: pool.frefru_getExternalConnectionString(),
      });
      let versionOK = await dbVersionCheck();
      resolve(versionOK);
    } else {
      console.error('No Connection to: ' + pool.frefru_getExternalConnectionString());
      let settings = serverStatus.getSettings();
      if (settings.retryDB > 0) {
        settings.retryDB--;
        console.error(`DB connection retry (${settings.retryDB} more) in ${settings.delay / 1000} seconds.`);
        setTimeout(async () => {
          resolve(await checkDBReady());
        }, settings.delay); // try again
      } else {
        console.error('NO CONNECTION TO DATABASE. Please check .env File. Restart server to enable connection.');
        serverStatus.addErrorStatus({
          system: 'database',
          status: 'NOT connected',
          url: pool.frefru_getExternalConnectionString(),
        });
        resolve(false);
      }
    }
  });
}

/***
 *  @returns true when the db is ready to be used
 */
async function ready() {
  let client = null;
  try {
    client = await pool.connect();
    await client.query('SELECT NOW()');
    return true;
  } catch (e) {
    // we dont use e - just the fact that the db does not work
    return false;
  } finally {
    if (client) client.release();
  }
}

/***
 *  @returns true when the db version is matching
 */
async function dbVersionCheck() {
  let client = null;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT distinct value from dbinformation where key=$1', ['version']);
    if (!res.rows.length > 0) {
      serverStatus.addErrorStatus({
        system: 'database',
        status: `Version ${frefru_DB_VERSION} expected, but key=version not found in table dbinformation`,
        url: pool.frefru_getExternalConnectionString(),
      });
      return false;
    } else {
      if (res.rows[0].value == frefru_DB_VERSION) {
        serverStatus.addInfoStatus({
          system: 'database',
          status: `version ${frefru_DB_VERSION} OK`,
          url: pool.frefru_getExternalConnectionString(),
        });
        return true;
      } else {
        serverStatus.addErrorStatus({
          system: 'database',
          status: `Version ${frefru_DB_VERSION} expected, but found ${res.rows[0].value}`,
          url: pool.frefru_getExternalConnectionString(),
        });
        return false;
      }
    }
  } catch (_e) {
    // we dont use e - just the fact that the db does not work
    serverStatus.addErrorStatus({
      system: 'database',
      status: `Version ${frefru_DB_VERSION} expected, but table "dbinformation" not found.`,
      url: pool.frefru_getExternalConnectionString(),
    });
  } finally {
    if (client) client.release();
  }
}

/**
 * Generic helper to execute database queries with or without parameters
 */
async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } catch (error) {
    console.error(error);
    return { errors: [error.message] };
  } finally {
    client.release();
  }
}

module.exports = {
  checkDBReady,
  ready,
  executeQuery,
  getConnectionString,
};
