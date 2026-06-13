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

const getSkuService = async (productId, skuId = null) => {
  const product = await findOne({ _id: new ObjectId(productId) });

  const productSku = product.productSkuses;

  if (skuId) {
    const sku = productSku.filter((sku) => skuId == sku.id);
    return sku;
  }

  return productSku;
};

const addSkuService = async (SkuData, user, productId) => {
  const vendorId = user._id;

  if (!SkuData) {
    throw new Error("SkuData is missing");
  }

  const existingProduct = await getExistingProduct(vendorId, productId);

  existingProduct[0].productSkuses.push(product);
  const { ...newProduct } = existingProduct[0];

  const response = await updateOne(COLLECTION.PRODUCT, newProduct);

  return response;
};

const updateSkuService = async (productSku, vendorId, productId, skuId) => {
  try {
    if (!productSku) {
      throw new Error("Product SKU details missing in request body");
    }

    const existingProduct = await getExistingProduct(vendorId, productId);

    const updatedSkus = updateSkuHelper(existingProduct);

    const response = await updateProductSku(updatedSkus, productId);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSkuService = async (vendorId, skuId, productId) => {
  const existingProduct = await getExistingProduct(vendorId, productId);

  const updateProductSkus = deleteSkuHelper(existingProduct);

  const response = updateProductSku(updateProductSkus, productId);
  return response;
};

const addImageService = async (body, params, user) => {
  try {
    const imageUrl = body.imageUrl;
    const imgId = body.id || crypto.randomUUID();

    const productId = params.productId;
    const skuId = params.skuId;
    const vendorId = user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    const updatedSkus = addImageHelper(existingProduct);

    const response = updateProductSku(updatedSkus, productId);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getImageService = async (body, params, user) => {
  try {
    const productId = params.productId;
    const skuId = params.skuId;
    const vendorId = user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    const images = getImageHelper(existingProduct);
    return images;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteImageService = async (body, params, user) => {
  try {
    const productId = params.productId;
    const skuId = params.skuId;
    const imageId = params.imageId;
    const vendorId = user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    const updatedSkus = deleteImageHelper(existingProduct);

    const response = await updateOne(
      { _id: new ObjectId(productId) },
      { productSkuses: updatedSkus },
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
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
