import { ObjectId, ReturnDocument } from "mongodb";
import { productSchema } from "../model/productSchema.model.js";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";

// products API's
const addProduct = async function (req, res) {
  try {
    const user = req.user;
    const userId = req.userId;

    const product = req.body;
    console.log("product");
    console.log(product);

    if (!product) {
      logger.error("Product details missing in request body");
      return res.status(400).json({ message: "product details missing" });
    }

    const result = productSchema.validate({
      product_name: product.productName,
      price: product.productSkuses[0].price,
    });

    if (result.error) {
      logger.error(
        `Product validation failed: ${result.error.details[0].message}`,
      );
      return res.status(400).json({ message: result.error.details[0].message });
    }

    const row = await mdb
      .collection("products")
      .insertOne({ vendorId: userId, ...product });

    logger.info(` Product added successfully : ${row}`);
    return res
      .status(200)
      .json({ message: "product added successfully ", row });
  } catch (error) {
    logger.error(`Error adding product: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const getAllProducts = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const vendorId = req.user._id;
    console.log(" vendorId ", vendorId);
    let products;

    if (role == "vendor") {
      products = await mdb.collection("products").find({ vendorId }).toArray();
    }

    console.log(products, " all products ");
    logger.info(
      `Products retrieved successfully for user ID: ${vendorId} with role: ${role}`,
    );
    return res.status(200).json(products);
  } catch (error) {
    logger.error(`Error retrieving products: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getProduct = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.user._id;
    const productId = req.params.id;
    console.log(id, " ***id*** ");
    console.log(productId, " productId ");
    let products;

    if (role == "vendor") {
      products = await mdb
        .collection("products")
        .find({ vendorId: id, _id: new ObjectId(productId) })
        .toArray();
    }
    console.log(products, " product ");
    logger.info(
      `Product retrieved successfully for user ID: ${id} with role: ${role} and product ID: ${productId}`,
    );
    return res.status(200).json(products);
  } catch (error) {
    logger.error(`Error retrieving product: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.user._id;
    const productId = req.params.id;

    let products;

    if (role == "vendor") {
      products = await mdb
        .collection("products")
        .findOne({ vendorId: id, _id: new ObjectId(productId) });
    }

    logger.info(
      `Product retrieved successfully for user ID: ${id} with role: ${role} and product ID: ${productId}`,
    );
    console.log(products, " product ");

    if (!products) {
      logger.error(
        `Product not found for user ID: ${id} with role: ${role} and product ID: ${productId}`,
      );
      return res.status(400).json({ message: "product not found" });
    }

    const response = await mdb
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    logger.info(
      `Product deleted successfully for user ID: ${id} with role: ${role} and product ID: ${productId}`,
    );
    return res.status(200).json({ message: "product deleted ", response });
  } catch (error) {
    logger.error(`Error deleting product: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.user._id;
    const productId = req.params.id;
    const product = req.body;

    let existingProducts;

    if (role == "vendor") {
      // showing only the vendors product
      existingProducts = await mdb
        .collection("products")
        .find({ vendorId: id, _id: new ObjectId(productId) });
    }

    console.log(existingProducts, " existingProducts in update product ");

    if (!existingProducts) {
      logger.error(
        `Product not found for update: User ID: ${id}, Role: ${role}, Product ID: ${productId}`,
      );
      return res.status(400).json({ message: " product not found " });
    }

    const response = await mdb
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: { ...product } });

    logger.info(
      `Product updated successfully for user ID: ${id} with role: ${role} and product ID: ${productId}`,
    );
    return res.status(200).json({ message: "product updated ", response });
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

//  product sku's
const getAllSKU = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.params.id;
    console.log("role ", role, " phoneNumber ", phoneNumber, " id ", id);
    let products;
    let productSkus;

    if (role == "vendor") {
      products = await mdb
        .collection("products")
        .find({ _id: new ObjectId(id) })
        .toArray();

      productSkus = products.map((product) => product.productSkuses);
    }

    console.log(products, " products ");
    console.log(productSkus, " product sku ");

    logger.info(
      `Product SKUs retrieved successfully for user ID: ${id} with role: ${role}`,
    );

    return res.status(200).json(productSkus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getSKU = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.params.id;
    const productId = req.params.id;

    let product;

    if (role == "vendor") {
      // showing only the vendors product
      [product] = await db.execute(
        `select * from product_skus where id = ?  `,
        [id],
      );
    }

    console.log(product, " SKU  ");

    if (!product) {
      logger.error(
        `Product SKU not found: User ID: ${id}, Role: ${role}, SKU ID: ${productId}`,
      );
      return res.status(400).json({ message: " product not found " });
    }

    logger.info(
      `Product SKU retrieved successfully for user ID: ${id} with role: ${role} and SKU ID: ${productId}`,
    );

    return res.status(200).json(product);
  } catch (error) {
    logger.error(`Error retrieving product SKU: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const addSKU = async function (req, res) {
  try {
    const product = req.body;
    console.log(product, " sku data in addSKU ");
    const user = req.user;
    const id = req.userId;
    const productId = req.params.id;

    if (!product) {
      logger.error("Product SKU details missing in request body");
      return res.status(400).json({ message: "product details missing" });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found  with id ", productId });
    }
    existingProduct[0].productSkuses.push(product);
    console.log("existing product");
    console.log(existingProduct);
    const { _id, ...newProduct } = existingProduct[0];
    console.log(" new product ");
    console.log(newProduct, " new product ");

    const response = await mdb
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: { ...newProduct } });

    logger.info(
      `Product SKU added successfully for user ID: ${id} with role: ${user.role}`,
    );
    return res
      .status(200)
      .json({ message: " product added successfully ", response });
  } catch (error) {
    logger.error(`Error adding product SKU: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateSKU = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.user._id;
    const skuId = req.query.skuId;
    const productId = req.query.productId;
    const productSku = req.body;

    console.log("productSku");
    console.log(productSku);

    console.log("skuId ", skuId);
    console.log("productId ", productId);
    let existingProducts;

    if (role != "vendor") {
      return res.status(400).json({ message: "your role is not authorized " });
    }

    if (!productSku) {
      logger.error("Product SKU details missing in request body");
      return res.status(400).json({ message: "product SKU details missing" });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found with id ", productId });
    }

    console.log(" existingProduct in update product ");
    console.log(existingProduct);

    if (!existingProduct) {
      logger.error(
        `Product SKU not found for update: User ID: ${id}, Role: ${role}, SKU ID: ${skuId}`,
      );
      return res.status(400).json({ message: " product not found " });
    }
    const tempSkus = existingProduct[0].productSkuses;

    const updateProductSkus = tempSkus.map((sku) => {
      if (sku.id == skuId) {
        return productSku;
      } else {
        return sku;
      }
    });

    console.log("updateProductSkus");
    console.log(updateProductSkus);

    const response = mdb
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updateProductSkus } },
      );

    logger.info(
      `product SKU updated successfully for user ID: ${id} with role: ${role} and SKU ID: ${skuId}`,
    );

    return res.status(200).json({ message: "product updated ", response });
  } catch (error) {
    logger.error(`Error updating product SKU: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteSKU = async function (req, res) {
  // try {
  //   const role = req.user.role;
  //   const phoneNumber = req.user.phoneNumber;
  //   const id = req.user._id;
  //   const skuId = req.params.id;

  //   let product;

  //   if (role == "vendor") {
  //     // showing only the vendors product
  //     [product] = await db.execute(`select * from product_skus where id = ?`, [
  //       skuId,
  //     ]);
  //   }

  //   console.log(product, " sku in delete sku ");

  //   if (!product) {
  //     logger.error(
  //       `Product SKU not found for deletion: User ID: ${id}, Role: ${role}, SKU ID: ${skuId}`,
  //     );
  //     return res.status(400).json({ message: "sku not found" });
  //   }

  //   const [row] = await db.execute(`delete from product_skus where id = ?`, [
  //     skuId,
  //   ]);
  //   logger.info(
  //     `Product SKU deleted successfully for user ID: ${id} with role: ${role} and SKU ID: ${skuId}`,
  //   );
  //   return res.status(200).json({ message: "product deleted ", row });
  // } catch (error) {
  //   logger.error(`Error deleting product SKU: ${error.message}`);
  //   console.log(error);
  //   return res.status(500).json({ message: error.message });
  // }

  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const id = req.user._id;
    const skuId = req.query.skuId;
    const productId = req.query.productId;

    console.log("skuId ", skuId);
    console.log("productId ", productId);
    let existingProducts;

    if (role != "vendor") {
      return res.status(400).json({ message: "your role is not authorized " });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found with id ", productId });
    }

    console.log(" existingProduct in delete sku ");
    console.log(existingProduct);

    if (!existingProduct) {
      logger.error(
        `Product SKU not found for update: User ID: ${id}, Role: ${role}, SKU ID: ${skuId}`,
      );
      return res.status(400).json({ message: " product not found " });
    }
    const tempSkus = existingProduct[0].productSkuses;

    const updateProductSkus = tempSkus.filter((sku) => sku.id != skuId);

    console.log("updateProductSkus");
    console.log(updateProductSkus);

    const response = mdb
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updateProductSkus } },
      );

    logger.info(
      `product SKU updated successfully for user ID: ${id} with role: ${role} and SKU ID: ${skuId}`,
    );

    return res.status(200).json({ message: "product sku deleted ", response });
  } catch (error) {
    logger.error(`Error updating product SKU: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Product Images
const addImage = async function (req, res) {
  try {
    const imageUrl = req.body.imageUrl;
    const imgId = req.body.id || Date.now().toString();

    const productId = req.params.productId;
    const skuId = req.params.skuId;

    const role = req.user.role;
    const id = req.user._id;

    if (!productId || !skuId) {
      logger.error("Product SKU ID or productId missing in request parameters");
      return res.status(400).json({ message: "product skus id missing" });
    }

    let existingProducts;

    if (role != "vendor") {
      return res.status(400).json({ message: "your role is not authorized " });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found with id ", productId });
    }

    console.log(" existingProduct in delete sku ");
    console.log(existingProduct);

    const tempSku = existingProduct[0].productSkuses;

    const updatedSkus = tempSku.map((sku) => {
      if ((sku.id = skuId)) {
        sku.images.push({
          id: imgId,
          imageUrl,
        });
      }
      return sku;
    });

    console.log("updatedSkus ");
    console.log(updatedSkus);
    logger.info(`sku images updated successfully for Product SKU ID: ${skuId}`);

    const response = await mdb
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updatedSkus } },
      );

    return res.status(200).json(response);
  } catch (error) {
    logger.error(`Error retrieving images: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getImages = async function (req, res) {
  try {
    const productId = req.params.productId;
    const skuId = req.params.skuId;
    const role = req.user.role;
    const id = req.user._id;

    if (!productId || !skuId) {
      logger.error("Product SKU ID or productId missing in request parameters");
      return res.status(400).json({ message: "product skus id missing" });
    }

    let existingProducts;

    if (role != "vendor") {
      return res.status(400).json({ message: "your role is not authorized " });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found with id ", productId });
    }

    console.log(" existingProduct in delete sku ");
    console.log(existingProduct);

    const tempSku = existingProduct[0].productSkuses;
    const sku = tempSku.filter((sku) => sku.id == skuId);
    const images = sku[0].images;
    console.log("images ");
    console.log(images);
    logger.info(`Images retrieved successfully for Product SKU ID: ${skuId}`);

    return res.status(200).json(images);
  } catch (error) {
    logger.error(`Error retrieving images: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteImage = async function (req, res) {
  try {
    const productId = req.params.productId;
    const skuId = req.params.skuId;
    const imageId = req.params.imageId;

    const role = req.user.role;
    const id = req.user._id;

    if (!productId || !skuId) {
      logger.error("Product SKU ID or productId missing in request parameters");
      return res.status(400).json({ message: "product skus id missing" });
    }

    let existingProducts;

    if (role != "vendor") {
      return res.status(400).json({ message: "your role is not authorized " });
    }

    const existingProduct = await mdb
      .collection("products")
      .find({ vendorId: id, _id: new ObjectId(productId) })
      .toArray();

    if (existingProduct.length == 0) {
      return res
        .status(400)
        .json({ message: "product not found with id ", productId });
    }

    console.log(" existingProduct in delete sku ");
    console.log(existingProduct);

    const tempSku = existingProduct[0].productSkuses;
    const sku = tempSku.filter((sku) => sku.id == skuId);

    const updatedSkus = tempSku.map((sku) => {
      if ((sku.id = skuId)) {
        const updatedImages = sku.images.filter((image) => image.id != imageId);
        sku.images = updatedImages;
      }
      return sku;
    });

    console.log("updatedSkus ");
    console.log(updatedSkus);
    logger.info(`sku images updated successfully for Product SKU ID: ${skuId}`);

    const response = await mdb
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        { $set: { productSkuses: updatedSkus } },
      );

    return res.status(200).json(response);
  } catch (error) {
    logger.error(`Error retrieving images: ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// order tracking PATCH /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderTracksId = req.body.id || Date.now().toString();
    const remarks = req.body.remarks;
    const status = req.body.status;

    const role = req.user.role;

    if (role != "vendor" && role != "admin") {
      return res
        .status(400)
        .json({ message: "You are not authorized to update order status" });
    }

    const existingOrder = await mdb
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });

    if (!existingOrder) {
      logger.error(`Order not found for update: Order ID: ${orderId}`);
      return res.status(400).json({ message: "order not found" });
    }

    const newOrderTracks = existingOrder.orderTracks;

    const newRecord = {
      id: orderTracksId,
      remarks,
      orderStatus: status,
    };
    newOrderTracks.push(newRecord);

    const response = await mdb.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          orderTracks: newOrderTracks,
        },
      },
    );

    logger.info(
      `Order status updated successfully for Order ID: ${orderId} by user ID: ${req.user.id} with role: ${role}`,
    );
    return res
      .status(200)
      .json({ message: "Order status updated successfully", response });
  } catch (error) {
    logger.error(`Error updating order status: ${error.message}`);
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Internal server error" });
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
  getSKU,
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
