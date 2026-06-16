import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import {
  deleteOne,
  find,
  findOne,
  insertOne,
  updateOne,
} from "../repository/common.repository.js";
import { ApiError } from "../util/ApiError.util.js";

const getExistingProduct = async (vendorId, productId) => {
  const existingProduct = await find(COLLECTION.PRODUCT, {
    vendorId: vendorId,
    _id: new ObjectId(productId),
  });

  if (existingProduct.length == 0) {
    throw new ApiError(400, "product not found");
  }

  return existingProduct;
};

const addProductService = async (product, user) => {
  const response = await insertOne(COLLECTION.PRODUCT, {
    vendorId: user._id,
    ...product,
  });
  return response;
};

const getProductService = async (fields) => {
  const response = await find(COLLECTION.PRODUCT, fields);
  return response;
};

const deleteProductService = async (userId, productId) => {
  const existingProduct = await getExistingProduct(userId, productId);

  const products = await deleteOne(COLLECTION.PRODUCT, {
    _id: new ObjectId(productId),
  });
  return products;
};
const updateProductService = async (vendorId, productId, product) => {
  const existingProducts = await getExistingProduct(vendorId, productId);

  const response = await updateOne(
    COLLECTION.PRODUCT,
    { _id: new ObjectId(productId) },
    product,
  );
  return response;
};

export {
  getExistingProduct,
  addProductService,
  getProductService,
  deleteProductService,
  updateProductService,
};
