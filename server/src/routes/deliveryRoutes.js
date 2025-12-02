import express from 'express';
import {postDelivery} from '../controller/deliveryController.js';

const router = express.Router();

 router.post("/", postDelivery);
// router.delete("/:id", delProject);
// router.patch("/:id", updateProject);

export default router;
