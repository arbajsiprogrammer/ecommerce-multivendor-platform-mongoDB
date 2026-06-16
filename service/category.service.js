import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import {
  deleteOne,
  find,
  findById,
  insertOne,
} from "../repository/common.repository.js";
import {
  findByName,
  updateCategoryById,
} from "../repository/category.repository.js";
import { ApiError } from "../util/ApiError.util.js";

const isCategoryExist = async (categoryId) => {
  const existingCategory = await findById(COLLECTION.CATEGORY, {
    _id: categoryId,
  });
  return existingCategory;
};

const updateCategoryService = async (existingCategory, category) => {
  const response = await updateCategoryById(existingCategory, category);

  return response;
};

const addCategoryService = async (category) => {
  const existingCategory = await findByName(category.categoryName);

  if (existingCategory) {
    throw new ApiError(
      400,
      `category with name ${category.categoryName} found`,
    );
  }

  const response = await insertOne(COLLECTION.CATEGORY, category);

  return response;
};

const deleteCategoryService = async (categoryId) => {
  const existingCategory = await isCategoryExist(categoryId);

  const response = await deleteOne(COLLECTION.CATEGORY, {
    _id: existingCategory._id,
  });

  return response;
};

const getCategoryService = async (categoryId) => {
  const category = await findById(COLLECTION.CATEGORY, {
    _id: categoryId,
  });
  return category;
};
const getCategoriesService = async () => {
  const category = await find(COLLECTION.CATEGORY, {});
  return category;
};
export {
  isCategoryExist,
  updateCategoryService,
  addCategoryService,
  deleteCategoryService,
  getCategoryService,
  getCategoriesService,
};
