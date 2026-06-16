import { errorResponse, successResponse } from "../helper/response.helper.js";
import logger from "../service/log.service.js";
import {
  addImageService,
  addSkuService,
  deleteImageService,
  deleteSkuService,
  getImageService,
  getSkuService,
  updateSkuService,
} from "../service/sku.service.js";

//  product sku's
const getAllSKU = async function (req, res) {
  const productId = req.params.productId;
  console.log("productId ", productId);

  const sku = await getSkuService(productId);

  successResponse(res, 200, "product  SKUs retrieved  successfully", sku);
};

const addSKU = async function (req, res) {
  const SkuData = req.body;
  const user = req.user;
  const productId = req.params.productId;

  const response = await addSkuService(SkuData, user, productId);

  successResponse(res, 200, "product added successfully", response);
};

const updateSKU = async function (req, res) {
  const vendorId = req.user._id;
  const skuId = req.params.skuId;
  logger.info(`inside updated sku ${skuId}`);
  const productId = req.params.productId;
  const productSku = req.body;

  const response = await updateSkuService(
    productSku,
    vendorId,
    productId,
    skuId,
  );

  successResponse(res, 200, "product SKU updated", response);
};

const deleteSKU = async function (req, res) {
  const vendorId = req.user._id;
  const skuId = req.params.skuId;
  const productId = req.params.productId;

  const response = await deleteSkuService(vendorId, skuId, productId);

  successResponse(res, 200, "product SKU deleted", response);
};

// Product Images
const addImage = async function (req, res) {
  const body = req.body;

  const params = req.params;
  const user = req.user;

  const response = await addImageService(body, params, user);

  successResponse(res, 200, "product SKU image added ", response);
};

const getImages = async function (req, res) {
  const params = req.params;
  const user = req.user;

  const response = await getImageService(params, user);

  successResponse(res, 200, "Images retrieved successfully", response);
};

const deleteImage = async function (req, res) {
  const params = req.params;
  const user = req.user;

  const response = await deleteImageService(params, user);

  successResponse(res, 200, "sku images updated successfully", response);
};
export {
  getAllSKU,
  addSKU,
  updateSKU,
  deleteSKU,
  addImage,
  getImages,
  deleteImage,
};
