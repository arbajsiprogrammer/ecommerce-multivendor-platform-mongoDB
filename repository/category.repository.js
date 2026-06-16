import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";

const findByName = async (categoryName) => {
  const response = await mdb
    .collection(COLLECTION.CATEGORY)
    .findOne({ categoryName });

  return response;
};

const updateCategoryById = async (existingCategory, category) => {
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

  return response;
};

export { findByName, updateCategoryById };
