import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";

const getAllProducts = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const customerId = req.user._id;

    // showing all products
    const products = await mdb.collection("products").find({}).toArray();

    console.log(products, " all products ");
    logger.info(`fetched all products`);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    logger.error(`Error fetching all products: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const getProduct = async function (req, res) {
  try {
    const role = req.user.role;
    const phoneNumber = req.user.phoneNumber;
    const userId = req.user._id;
    const productId = req.params.id;

    // showing only one product
    const products = await mdb
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    console.log(products, " product ");
    logger.info(`fetched product with id ${productId}`);
    return res.status(200).json(products);
  } catch (error) {
    logger.error(
      `Error fetching product with id ${req.params.id}: ${error.message}`,
    );
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// get record by category
const getProductsByCategory = async function (req, res) {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      logger.warn(`Category ID not provided in request`);
      return res.status(400).json({ message: "category ID not found" });
    }
    const products = await mdb
      .collection("products")
      .find({ categoryId: Number(categoryId) })
      .toArray();
    console.log("products");
    console.log(products);
    logger.info(`fetched products for category ID ${categoryId}`);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error : " + error });
  }
};

// Pagination
const getProductsByPage = async function (req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log(typeof page, typeof limit, typeof offset);

    const products = await mdb
      .collection("products")
      .aggregate([{ $skip: offset }, { $limit: limit }])
      .toArray();

    console.log("products");
    console.log(products);

    logger.info(`fetched products for page ${page} with limit ${limit}`);
    return res.status(200).json(products);
  } catch (error) {
    logger.error(`Error fetching products for page : ${error.message}`);
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

export { getAllProducts, getProduct, getProductsByCategory, getProductsByPage };
