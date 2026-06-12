import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import {
  deleteOne,
  findById,
  findOne,
  insertOne,
} from "../repository/common.repository.js";
import {
  findByName,
  updateCategory,
  updateCategoryById,
} from "../repository/category.repository.js";

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
    throw new Error(`category with name ${categoryName} found`);
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

export {
  isCategoryExist,
  updateCategoryService,
  addCategoryService,
  deleteCategoryService,
};
