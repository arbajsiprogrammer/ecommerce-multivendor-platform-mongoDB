import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryService,
  isCategoryExist,
  updateCategoryService,
} from "../service/category.service.js";
import { find, findById, findOne } from "../repository/common.repository.js";
import { findByName } from "../repository/category.repository.js";

// categories
const getAllCategories = async function (req, res) {
  try {
    const categories = await getCategoriesService();

    successResponse(res, 200, "categories fetched successfully", categories);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getCategory = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;
    const category = await getCategoryService(categoryId);

    successResponse(res, 200, "category fetched successfully", category);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const updateCategory = async function (req, res) {
  try {
    const category = req.body;
    const categoryId = req.params.categoryId;

    // check if Category exist or not
    const existingCategory = await isCategoryExist(categoryId);

    const response = await updateCategoryService(existingCategory, category);

    successResponse(
      res,
      200,
      `category updated successfully with id: ${categoryId}`,
      response,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const addCategory = async function (req, res) {
  try {
    const category = req.body;

    const response = await addCategoryService(category);

    successResponse(res, 200, "category added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const deleteCategory = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;

    const response = await deleteCategoryService(categoryId);

    successResponse(res, 200, "category deleted ", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export {
  getAllCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
