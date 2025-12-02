import asyncHandler from 'express-async-handler';
import * as model from '../model/productModel.js';

// // eslint-disable-next-line import/prefer-default-export
export const getProductsOverview = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getProductOverview());
});

export const getProductsOverviewPerCountry = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getProductOverviewPerCountry(req.params.country));
});

export const getProductOverviewPerCity = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getProductOverviewPerCity(req.params.city));
});
