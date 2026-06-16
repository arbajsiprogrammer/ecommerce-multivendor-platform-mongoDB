import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import { successResponse } from "../helper/response.helper.js";
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
import { asyncHandler } from "../util/asyncHandler.util.js";

// categories
const getAllCategories = asyncHandler(async function (req, res) {
  const categories = await getCategoriesService();

  successResponse(res, 200, "categories fetched successfully", categories);
});

const getCategory = asyncHandler(async function (req, res) {
  const categoryId = req.params.categoryId;
  const category = await getCategoryService(categoryId);

  successResponse(res, 200, "category fetched successfully", category);
});

const updateCategory = asyncHandler(async function (req, res) {
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
});

const addCategory = asyncHandler(async function (req, res) {
  const category = req.body;

  const response = await addCategoryService(category);

  successResponse(res, 200, "category added successfully", response);
});

const deleteCategory = asyncHandler(async function (req, res) {
  const categoryId = req.params.categoryId;

  const response = await deleteCategoryService(categoryId);

  successResponse(res, 200, "category deleted ", response);
});

export {
  getAllCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
