import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import debug from 'debug';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import serverStatus from './model/serverStatus.cjs';
import dbInterface from './dbconnection/dbInterface.cjs';

import testRoute from './routes/testRoutes.js';
import productRoutes from './routes/productRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import producerRoutes from './routes/producerRoutes.js';
import storageRoutes from './routes/storageRoutes.js';

import { setupAutoApis } from './KIgenerated/autoapi.js';

let app = null;

dotenv.config();
debug.enable(process.env.DEBUG);

const startup = debug('startup');
const dirname = path.resolve();

// initialise server info
serverStatus.updateSettingsFromEnvironment();

async function asyncStartServer() {
  // await dbInterface.initialiseDBPool();
  // setup database connection
  const dbOk = await dbInterface.checkDBReady();

  if (!dbOk) {
    console.error('******************************************************************');
    console.error('* Please fix errors reported above before restarting the server. *');
    console.error('******************************************************************');
    process.exit(1);
  }

  // setup express
  app = express();

  app.use(morgan('dev'));

  // we need to inform cors that the client has access
  // this is needed because we send authenication information
  // only relevant for developing purposes - as no CORS is happening in production
  // only available in development mode
  let corsOptions = {};
  const isDevelopment = true;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:8080';
  if (isDevelopment) {
    if (clientUrl) {
      corsOptions = {
        origin: clientUrl,
        credentials: true,
      };
    }
    app.use(cors(corsOptions));
  }

  app.use(express.static(path.join(dirname, '/public')));
  app.use(express.json());

  app.use('/test', testRoute);
  app.use('/api/products', productRoutes);
  app.use('/api/deliveries', deliveryRoutes);
  app.use('/api/producers', producerRoutes);
  app.use('/api/storages', storageRoutes);

  // serialize api is located at /sapi
  {
    // // TODO use connectionString
    // const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
    // const postgresUrl = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
    app.use('/sapi', await setupAutoApis(dbInterface.getConnectionString()));
  }

  app.use(errorHandler);
  app.use(notFound);

  // don´t start server when in test mode
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => startup(`Server is running on port ${PORT}`));
}

// starting async part of the setup
asyncStartServer();

export default app;
