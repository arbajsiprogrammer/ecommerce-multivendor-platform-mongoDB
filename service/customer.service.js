import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { find, aggregation } from "../repository/common.repository.js";

const getAllCustomersService = async () => {
  const response = await find(COLLECTION.CUSTOMER, {});
  return response;
};

const getAllProductsService = async (user) => {
  const role = user.role;
  const phoneNumber = user.phoneNumber;
  const customerId = user._id;

  // showing all products
  const products = await find(COLLECTION.PRODUCT);
  return products;
};

const getAllProductService = async (params) => {
  const productId = params.id;

  // showing all products
  const products = await find(COLLECTION.PRODUCT, {
    _id: new ObjectId(productId),
  });
  return products;
};

const getProductsByCategoryService = async (categoryId) => {
  if (!categoryId) {
    throw new Error(`Category ID not provided in request`);
  }

  const products = await find(COLLECTION.PRODUCT, {
    categoryId: Number(categoryId),
  });

  return products;
};

const getProductsByPageService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const products = await aggregation(COLLECTION.PRODUCT, [
    { $skip: offset },
    { $limit: limit },
  ]);

  return products;
};

export {
  getAllCustomersService,
  getAllProductsService,
  getAllProductService,
  getProductsByCategoryService,
  getProductsByPageService,
};
