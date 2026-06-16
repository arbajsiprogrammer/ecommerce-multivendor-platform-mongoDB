import { ObjectId } from "mongodb";
import { findOne, updateOne } from "../repository/common.repository.js";
import { getExistingProduct } from "./product.service.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";
import {
  addImageHelper,
  deleteImageHelper,
  deleteSkuHelper,
  getImageHelper,
  updateSkuHelper,
} from "../helper/sku.helper.js";
import { updateProductSku } from "../repository/sku.repository.js";
import logger from "./log.service.js";
import { ApiError } from "../util/ApiError.util.js";

const getSkuService = async (productId, skuId = null) => {
  const product = await findOne(COLLECTION.PRODUCT, {
    _id: new ObjectId(productId),
  });

  const productSku = product.productSkuses;

  if (skuId) {
    const sku = productSku.filter((sku) => skuId == sku.id);
    return sku[0];
  }

  return productSku;
};

const addSkuService = async (SkuData, user, productId) => {
  const vendorId = user._id;

  if (!SkuData) {
    throw new ApiError(400, "SkuData is missing");
  }

  const existingProduct = await getExistingProduct(vendorId, productId);

  existingProduct[0].productSkuses.push(SkuData);
  const { ...newProduct } = existingProduct[0];

  const response = await updateOne(
    COLLECTION.PRODUCT,
    { _id: new ObjectId(productId) },
    newProduct,
  );

  return response;
};

const updateSkuService = async (productSku, vendorId, productId, skuId) => {
  if (!productSku) {
    throw new ApiError(400, "Product SKU details missing in request body");
  }

  const existingProduct = await getExistingProduct(vendorId, productId);

  const updatedSkus = updateSkuHelper(existingProduct, skuId, productSku);

  logger.info(`updatedSkus : ${JSON.stringify(updatedSkus)}`);

  const response = await updateProductSku(updatedSkus, productId);

  return response;
};

const deleteSkuService = async (vendorId, skuId, productId) => {
  const existingProduct = await getExistingProduct(vendorId, productId);

  const updateProductSkus = deleteSkuHelper(existingProduct, skuId);

  const response = updateProductSku(updateProductSkus, productId);
  return response;
};

const addImageService = async (body, params, user) => {
  const imageUrl = body.imageUrl;
  const imgId = body.id || crypto.randomUUID();

  const productId = params.productId;
  const skuId = params.skuId;
  const vendorId = user._id;

  const existingProduct = await getExistingProduct(vendorId, productId);

  const updatedSkus = addImageHelper(existingProduct, skuId, imgId, imageUrl);

  const response = updateProductSku(updatedSkus, productId);

  return response;
};

const getImageService = async (params, user) => {
  const productId = params.productId;
  const skuId = params.skuId;
  const vendorId = user._id;

  const existingProduct = await getExistingProduct(vendorId, productId);

  const images = getImageHelper(existingProduct, skuId);
  return images;
};

const deleteImageService = async (params, user) => {
  const productId = params.productId;
  const skuId = params.skuId;
  const imageId = params.imageId;
  const vendorId = user._id;

  const existingProduct = await getExistingProduct(vendorId, productId);

  const updatedSkus = deleteImageHelper(existingProduct, skuId, imageId);

  const response = await updateOne(
    COLLECTION.PRODUCT,
    { _id: new ObjectId(productId) },
    { productSkuses: updatedSkus },
  );

  return response;
};
export {
  addSkuService,
  getSkuService,
  updateProductSku,
  updateSkuService,
  deleteSkuService,
  addImageService,
  getImageService,
  deleteImageService,
};
