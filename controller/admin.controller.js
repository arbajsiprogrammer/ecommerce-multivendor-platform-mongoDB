import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  findCategoryByName,
  isCategoryExist,
} from "../service/admin.service.js";

// categories
const getAllCategories = async function (req, res) {
  try {
    const categories = await mdb
      .collection(COLLECTION.CATEGORY)
      .find({})
      .toArray();

    successResponse(res, 200, "categories fetched successfully", categories);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const getCategory = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;

    const category = await mdb
      .collection(COLLECTION.CATEGORY)
      .findOne({ _id: new ObjectId(categoryId) });

    if (!category) {
      return errorResponse(res, 400, "categories not found ");
    }

    successResponse(res, 200, "category fetched successfully", category);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const updateCategory = async function (req, res) {
  try {
    const category = req.body.category;
    const categoryId = req.params.categoryId;
    // check if Category exist or not
    const existingCategory = await isCategoryExist(categoryId);

    const response = await mdb.collection(COLLECTION.CATEGORY).updateOne(
      { _id: existingCategory._id },
      {
        $set: {
          categoryName: category.categoryName,
          parentCategoryId:
            category.parentCategoryId || existingCategory.parentCategoryId,
        },
      },
    );

    successResponse(
      res,
      200,
      `category updated successfully with id: ${categoryId}`,
      response,
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const addCategory = async function (req, res) {
  try {
    const category = req.body;

    const existingCategory = await findCategoryByName(category.categoryName);

    const response = await mdb
      .collection(COLLECTION.CATEGORY)
      .insertOne(category);

    successResponse(res, 200, "category added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const deleteCategory = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;

    const existingCategory = await isCategoryExist(categoryId);

    const response = await mdb
      .collection(COLLECTION.CATEGORY)
      .deleteOne({ _id: existingCategory._id });

    successResponse(res, 200, "category deleted ", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

//vendors
const getAllVendors = async function (req, res) {
  try {
    const vendors = await mdb.collection(COLLECTION.VENDOR).find({}).toArray();

    successResponse(res, 200, "vendor data fetched", vendors);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
// customers
const getAllCustomers = async function (req, res) {
  try {
    const customers = await mdb
      .collection(COLLECTION.CUSTOMER)
      .find({})
      .toArray();

    successResponse(res, 200, "customers data fetched", customers);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
// orders
const getAllOrders = async function (req, res) {
  try {
    const orders = await mdb.collection(COLLECTION.ORDER).find({}).toArray();

    successResponse(res, 200, "orders data fetched", orders);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
// payments
const getAllPayments = async function (req, res) {
  try {
    const payments = await mdb
      .collection(COLLECTION.PAYMENT)
      .find({})
      .toArray();

    successResponse(res, 200, "payments data fetched", payments);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export {
  getAllCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllVendors,
  getAllCustomers,
  getAllOrders,
  getAllPayments,
};
