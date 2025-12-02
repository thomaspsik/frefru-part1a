const SERVER_VERSION = require("./serverVersion.cjs");

let data = [];
let settings = {
  retryDB: 3,
  delay: 1000,
};

module.exports = {
  getStatus() {
    return data;
  },
  addErrorStatus(status) {
    status.type = "error";
    data.push(status);
    console.error(
      `\x1b[1m\x1b[31mERROR in ${status.system}\x1b[0m ${status.url}: \x1b[1m\x1b[31m${status.status}\x1b[0m`
    );
  },
  addInfoStatus(status) {
    status.type = "info";
    data.push(status);
    console.log(`\x1b[32mINFO from ${status.system}\x1b[0m ${status.url}: ${status.status}`);
  },
  getSettings() {
    return settings;
  },
  updateSettingsFromEnvironment() {
    if (process.env.DB_RETRY != undefined) {
      settings.retryDB = process.env.DB_RETRY;
    }
    if (process.env.RETRY_DELAY != undefined) {
      settings.delay = process.env.RETRY_DELAY;
    }
    data.push({ system: "REST-API-Version", url: `${SERVER_VERSION}`, status: "OK", type: "info" });
  },
};
