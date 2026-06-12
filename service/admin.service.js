// import { ObjectId } from "mongodb";
// import COLLECTION from "../Constants/collectionName.constant.js";
// import { mdb } from "../util/db.util.js";

// const isCategoryExist = async (categoryId) => {
//   const existingCategory = await mdb
//     .collection(COLLECTION.CATEGORY)
//     .findOne({ _id: new ObjectId(categoryId) });

//   if (!existingCategory) {
//     throw new Error("category not found ");
//   }
//   return existingCategory;
// };

// const findCategoryByName = async (categoryName) => {
//   const existingCategory = await mdb
//     .collection(COLLECTION.CATEGORY)
//     .findOne({ categoryName });

//   if (existingCategory) {
//     throw new Error(`category with name ${categoryName} found`);
//   }
//   return existingCategory;
// };

// export { isCategoryExist, findCategoryByName };
