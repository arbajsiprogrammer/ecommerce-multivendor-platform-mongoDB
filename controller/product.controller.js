import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "../helper/response.helper.js";

import {
  addProductService,
  deleteProductService,
  getExistingProduct,
  getProductService,
  updateProductService,
} from "../service/product.service.js";
import { ApiError } from "../util/ApiError.util.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

// products API's
const addProduct = asyncHandler(async function (req, res) {
  const product = req.body;
  const user = req.user;

  const response = await addProductService(product, user);

  successResponse(res, 200, "product added successfully", response);
});

const getAllProducts = asyncHandler(async function (req, res) {
  const vendorId = req.user._id;

  const products = await getProductService({
    vendorId,
  });

  successResponse(res, 200, "products fetch successfully", products);
});

const getProduct = asyncHandler(async function (req, res, next) {
  const id = req.user._id;
  const productId = req.params.productId;

  const products = await getProductService({
    vendorId: id,
    _id: new ObjectId(productId),
  });

  successResponse(res, 200, "product fetch successfully", products);
});

const deleteProduct = asyncHandler(async function (req, res) {
  const userId = req.user._id;
  const productId = req.params.productId;

  const response = await deleteProductService(userId, productId);

  successResponse(res, 200, "product deleted successfully", response);
});

const updateProduct = asyncHandler(async function (req, res) {
  const vendorId = req.user._id;
  const productId = req.params.productId;
  const product = req.body;

  // showing only the vendors product

  const response = await updateProductService(vendorId, productId, product);

  successResponse(res, 200, "product updated successfully", response);
});

export { getAllProducts, getProduct, addProduct, deleteProduct, updateProduct };
