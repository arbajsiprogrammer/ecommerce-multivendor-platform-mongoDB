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

const getAllProducts = async function (req, res) {
  try {
    const products = await getAllProductsService(req.user);

    successResponse(res, 200, "fetched product successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getProduct = async function (req, res) {
  try {
    // showing only one product
    const products = await getAllProductService(req.params);

    successResponse(res, 200, "fetched product successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// get record by category
const getProductsByCategory = async function (req, res) {
  try {
    const categoryId = req.params.id;
    const products = await getProductsByCategoryService(categoryId);

    successResponse(
      res,
      200,
      "fetched product by category successfully",
      products,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// Pagination
const getProductsByPage = async function (req, res) {
  try {
    const products = await getProductsByPageService(req.query);

    successResponse(res, 200, "fetched products", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// customers
const getAllCustomers = async function (req, res) {
  try {
    const customers = await getAllCustomersService();
    successResponse(res, 200, "customers data fetched", customers);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
export {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getProductsByPage,
  getAllCustomers,
};
