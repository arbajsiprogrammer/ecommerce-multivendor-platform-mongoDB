import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  getAllCustomersService,
  getAllProductService,
  getAllProductsService,
  getProductsByCategoryService,
  getProductsByPageService,
} from "../service/customer.service.js";

const getAllProducts = asyncHandler(async function (req, res) {
  const products = await getAllProductsService(req.user);

  successResponse(res, 200, "fetched product successfully", products);
});

const getProduct = asyncHandler(async function (req, res) {
  // showing only one product
  const products = await getAllProductService(req.params);

  successResponse(res, 200, "fetched product successfully", products);
});

// get record by category
const getProductsByCategory = asyncHandler(async function (req, res) {
  const categoryId = req.params.id;
  const products = await getProductsByCategoryService(categoryId);

  successResponse(
    res,
    200,
    "fetched product by category successfully",
    products,
  );
});

// Pagination
const getProductsByPage = asyncHandler(async function (req, res) {
  const products = await getProductsByPageService(req.query);

  successResponse(res, 200, "fetched products", products);
});

// customers
const getAllCustomers = asyncHandler(async function (req, res) {
  const customers = await getAllCustomersService();
  successResponse(res, 200, "customers data fetched", customers);
});
export {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getProductsByPage,
  getAllCustomers,
};
