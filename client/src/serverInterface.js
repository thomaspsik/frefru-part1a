import axios from 'axios';
// TODO notifications
// import notifications from "@/notifications.js";
const notifications = {
  notify(string) {
    console.log(`Notification: ${string}`);
  },
  error(string) {
    console.error(`Notification ERROR: ${string}`);
  },
};
const REQUIRED_REST_API_VERSION = '0.0.2';

const instance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_REST_API_URL,
});

// function to report messages to the frontent
function reportMessages(messages) {
  if (messages && messages.length > 0) {
    for (const message of messages) {
      notifications.notify(message);
    }
  }
}

// generalized axios/REST API function with error handling
async function send(verb, url, payload) {
  try {
    const response = await instance.request({ method: verb, url, data: payload });

    // in the success case, we never return null/undefined since that would signal an error case
    const responseData = response || {};
    // console.log(responseData);
    return responseData;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a
      // status code that falls out of the range of 2xx
      // eventBus.$log.info(error.response);
      const responseData = error.response.data || {};
      reportMessages(responseData);
    } else if (error.request) {
      // The request was made but no response was received, `error.request`
      // is an instance of http.ClientRequest in Node.js
      // eventBus.$log.error(error.request);
      // TODO logging on client
      console.error(error.request);
      notifications.error({
        errcode: 'errors.communication.noresponse',
        details: { method: error.request.method, host: error.request.host, path: error.request.path },
      });
    } else {
      // Something happened in setting up the request and triggered an Error
      // TODO logging on client
      //eventBus.$log.error(error.message);
      console.error(error.message);

      notifications.error({ errcode: 'errors.communication.requestsetup', details: { message: error.message } });
    }
  }

  return null;
}

// default interface used
export default {
  getExpectedRESTApiVersion() {
    return REQUIRED_REST_API_VERSION;
  },
  async get(url) {
    return await send('GET', url);
  },
  async post(url, obj) {
    return await send('POST', url, obj);
  },
  async put(url, obj) {
    return await send('PUT', url, obj);
  },
  async delete(url) {
    return await send('DELETE', url);
  },
};
