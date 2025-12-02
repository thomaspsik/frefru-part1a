import express from 'express';
import { getProducers, getProducerDetail } from '../controller/producerController.js';

const router = express.Router();

router.get('/', getProducers);
router.get('/:pid', getProducerDetail);

export default router;
