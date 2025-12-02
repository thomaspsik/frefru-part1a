import express from 'express';
import * as contr from '../controller/productController.js';

const router = express.Router();

router.get('/', contr.getProductsOverview);
router.get('/country/:country', contr.getProductsOverviewPerCountry);
router.get('/city/:city', contr.getProductOverviewPerCity);

export default router;
