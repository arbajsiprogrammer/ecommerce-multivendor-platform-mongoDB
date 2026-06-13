import { errorResponse, successResponse } from "../helper/response.helper.js";

import {
  addProductService,
  deleteProductService,
  getExistingProduct,
  getProductService,
  updateProductService,
} from "../service/vendor.service.js";

// products API's
const addProduct = async function (req, res) {
  try {
    const product = req.body;
    const user = req.user;

    const response = await addProductService(product, user);

    successResponse(res, 200, "product added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
const getAllProducts = async function (req, res) {
  try {
    const vendorId = req.user._id;

    const products = await getProductService({ vendorId });

    successResponse(res, 200, "products fetch successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getProduct = async function (req, res) {
  try {
    const id = req.user._id;
    const productId = req.params.productId;

    const products = await getProductService({
      vendorId: id,
      _id: new ObjectId(productId),
    });

    successResponse(res, 200, "product fetch successfully", products);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const deleteProduct = async function (req, res) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const existingProduct = await getExistingProduct(userId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const response = await deleteProductService(existingProduct._id);

    successResponse(res, 200, "product deleted successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const updateProduct = async function (req, res) {
  try {
    const vendorId = req.user._id;
    const productId = req.params.productId;
    const product = req.body;

    // showing only the vendors product
    const existingProducts = await getExistingProduct(vendorId, productId);

    if (!existingProducts) {
      errorResponse(res, 400, "product not found");
    }

    const response = await updateProductService(productId, product);

    successResponse(res, 200, "product updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export { getAllProducts, getProduct, addProduct, deleteProduct, updateProduct };
