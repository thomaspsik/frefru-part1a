import asyncHandler from 'express-async-handler';
import * as model from '../model/producerModel.js';

export const getProducers = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getProducerList());
});

export const getProducerDetail = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getProducerDetail(req.params.pid));
});
