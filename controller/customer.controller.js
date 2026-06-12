import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import { getAllCustomersService } from "../service/customer.service.js";

const getAllProducts = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const customerId = req.user._id;

    // showing all products
    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .find({})
      .toArray();

    successResponse(res, 200, "fetched product successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getProduct = async function (req, res) {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    // showing only one product
    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .findOne({ _id: new ObjectId(productId) });

    successResponse(res, 200, "fetched product successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

// get record by category
const getProductsByCategory = async function (req, res) {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      errorResponse(res, 400, `Category ID not provided in request`);
    }
    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .find({ categoryId: Number(categoryId) })
      .toArray();

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .aggregate([{ $skip: offset }, { $limit: limit }])
      .toArray();

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
