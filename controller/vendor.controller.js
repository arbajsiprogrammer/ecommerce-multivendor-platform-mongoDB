import { ObjectId, ReturnDocument } from "mongodb";
import { productSchema } from "../model/productSchema.model.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import { errorResponse, successResponse } from "../helper/response.helper.js";
import COLLECTION from "../Constants/collectionName.constant.js";
import {
  getExistingProduct,
  updateProductSku,
} from "../service/vendor.service.js";
import { getExistingOrders } from "../service/order.service.js";

// products API's
const addProduct = async function (req, res) {
  try {
    const product = req.body;
    const user = req.user;
    const userId = user._id;

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .insertOne({ vendorId: userId, ...product });

    successResponse(res, 200, "product added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
const getAllProducts = async function (req, res) {
  try {
    const vendorId = req.user._id;

    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .find({ vendorId })
      .toArray();

    successResponse(res, 200, "products fetch successfully", products);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const getProduct = async function (req, res) {
  try {
    const id = req.user._id;
    const productId = req.params.productId;

    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    successResponse(res, 200, "product fetch successfully", products);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const deleteProduct = async function (req, res) {
  try {
    const id = req.user._id;
    const productId = req.params.productId;

    const products = await mdb
      .collection(COLLECTION.PRODUCT)
      .findOne({ vendorId: id, _id: new ObjectId(productId) });

    if (!products) {
      errorResponse(res, 400, "product not found");
    }

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .deleteOne({ _id: new ObjectId(productId) });

    successResponse(res, 200, "product deleted successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const updateProduct = async function (req, res) {
  try {
    const id = req.user._id;
    const productId = req.params.productId;
    const product = req.body;

    // showing only the vendors product
    const existingProducts = await mdb
      .collection(COLLECTION.PRODUCT)
      .findOne({ vendorId: id, _id: new ObjectId(productId) });

    if (!existingProducts) {
      errorResponse(res, 400, "product not found");
    }

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .updateOne({ _id: new ObjectId(productId) }, { $set: { ...product } });

    successResponse(res, 200, "product updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

//  product sku's
const getAllSKU = async function (req, res) {
  try {
    const id = req.params.id;

    let products;
    let productSkus;

    products = await mdb
      .collection(COLLECTION.PRODUCT)
      .find({ _id: new ObjectId(id) })
      .toArray();

    productSkus = products.map((product) => product.productSkuses);

    successResponse(
      res,
      200,
      "product  SKUs retrieved  successfully",
      productSkus,
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// const   = async function (req, res) {
//   try {
//     const id = req.params.id;
//     const productId = req.params.id;

//     let product;

//       // showing only the vendors product
//       [product] = await db.execute(
//         `select * from product_skus where id = ?  `,
//         [id],
//       );
//     }

//     console.log(product, " SKU  ");

//     if (!product) {
//       errorResponse(res, 400, "product not found");
//     }

//     successResponse(res, 200, "product  SKUs retrieved  successfully", product);
//   } catch (error) {
//     errorResponse(res, 500, error.message);
//   }
// };

const addSKU = async function (req, res) {
  try {
    const product = req.body;
    const user = req.user;
    const vendorId = user._id;
    const productId = req.params.id;

    if (!product) {
      errorResponse(res, 400, "product details missing");
    }

    const existingProduct = await getExistingProduct(vendorId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    existingProduct[0].productSkuses.push(product);
    const { _id, ...newProduct } = existingProduct[0];

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .updateOne({ _id: new ObjectId(productId) }, { $set: { ...newProduct } });

    successResponse(res, 200, "product added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const updateSKU = async function (req, res) {
  try {
    const vendorId = req.user._id;
    const skuId = req.query.skuId;
    const productId = req.query.productId;
    const productSku = req.body;

    if (!productSku) {
      errorResponse(res, 400, "Product SKU details missing in request body");
    }

    const existingProduct = await getExistingProduct(vendorId, productId);
    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const tempSkus = existingProduct[0].productSkuses;
    const response = await updateProductSku(tempSkus, skuId, productId);

    successResponse(res, 200, "product SKU updated", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const deleteSKU = async function (req, res) {
  try {
    const vendorId = req.user._id;
    const skuId = req.query.skuId;
    const productId = req.query.productId;

    const existingProduct = await getExistingProduct(vendorId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const tempSkus = existingProduct[0].productSkuses;

    const updateProductSkus = tempSkus.filter((sku) => sku.id != skuId);

    const response = mdb
      .collection(COLLECTION.PRODUCT)
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updateProductSkus } },
      );

    successResponse(res, 200, "product SKU deleted", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Product Images
const addImage = async function (req, res) {
  try {
    const imageUrl = req.body.imageUrl;
    const imgId = req.body.id || crypto.randomUUID();

    const productId = req.params.productId;
    const skuId = req.params.skuId;
    const vendorId = req.user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const tempSku = existingProduct[0].productSkuses;

    const updatedSkus = tempSku.map((sku) => {
      if (sku.id == skuId) {
        sku.images.push({
          id: imgId,
          imageUrl,
        });
      }
      return sku;
    });

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updatedSkus } },
      );

    successResponse(res, 200, "product SKU image added ", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const getImages = async function (req, res) {
  try {
    const productId = req.params.productId;
    const skuId = req.params.skuId;
    const vendorId = req.user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const tempSku = existingProduct[0].productSkuses;
    const sku = tempSku.filter((sku) => sku.id == skuId);
    const images = sku[0].images;
    console.log("images ");
    console.log(images);
    logger.info(`Images retrieved successfully for Product SKU ID: ${skuId}`);

    successResponse(res, 200, "Images retrieved successfully", images);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const deleteImage = async function (req, res) {
  try {
    const productId = req.params.productId;
    const skuId = req.params.skuId;
    const imageId = req.params.imageId;
    const vendorId = req.user._id;

    const existingProduct = await getExistingProduct(vendorId, productId);

    if (existingProduct.length == 0) {
      errorResponse(res, 400, "product not found");
    }

    const tempSku = existingProduct[0].productSkuses;
    const sku = tempSku.filter((sku) => sku.id == skuId);

    const updatedSkus = tempSku.map((sku) => {
      if (sku.id == skuId) {
        const updatedImages = sku.images.filter((image) => image.id != imageId);
        sku.images = updatedImages;
      }
      return sku;
    });

    const response = await mdb
      .collection(COLLECTION.PRODUCT)
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updatedSkus } },
      );

    successResponse(res, 200, "sku images updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// order tracking PATCH /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderTracksId = req.body.id || Date.now().toString();
    const remarks = req.body.remarks;
    const status = req.body.status;

    const existingOrder = await getExistingOrders(orderId);
    const newOrderTracks = existingOrder.orderTracks;

    const newRecord = {
      id: orderTracksId,
      remarks,
      orderStatus: status,
    };
    newOrderTracks.push(newRecord);

    const response = await mdb.collection(COLLECTION.ORDER).updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          orderTracks: newOrderTracks,
        },
      },
    );

    successResponse(res, 200, "Order status updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export {
  // product
  getAllProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  // product SKU
  getAllSKU,
  addSKU,
  updateSKU,
  deleteSKU,

  // images
  addImage,
  getImages,
  deleteImage,

  // update order status
  updateOrderStatus,
};
