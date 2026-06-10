import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";
import COLLECTION_NAMES from "../Constants/collectionName.constant.js";

// categories
const getAllCategories = async function (req, res) {
  try {
    const role = req.user.role;

    console.log(role, "inside get all categories...");

    const authRole = "admin";

    if (role != authRole) {
      logger.error("user must be admin to access categories");
      return res.status(400).json({ message: "user must be admin" });
    }

    const categories = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .find({})
      .toArray();

    console.log(categories, "inside categories..");
    logger.info("categories fetched successfully");

    return res.status(200).json(categories);
  } catch (error) {
    logger.error("error fetching categories: " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getCategory = async function (req, res) {
  try {
    const role = req.user.role;
    const categoryId = req.params.id;

    console.log(role, "inside get category...");

    const authRole = "admin";

    if (role != authRole) {
      logger.error("user must be admin to access category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const category = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .findOne({ _id: new ObjectId(categoryId) });

    if (!category) {
      return res.status(400).json({ message: " category not found " });
    }

    logger.info("category fetched successfully");
    console.log(category, "inside get category..");

    return res.status(200).json(category);
  } catch (error) {
    logger.error("error fetching category: " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async function (req, res) {
  try {
    const role = req.user.role;
    const category = req.body.category;
    const categoryId = req.params.id;

    console.log(role, "inside get category...");
    const authRole = "admin";

    if (role != authRole) {
      logger.error("user must be admin to update category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const existingCategory = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .findOne({ _id: new ObjectId(categoryId) });

    console.log(existingCategory, "inside get category..");

    if (!existingCategory) {
      logger.error("category not found with id: " + categoryId);
      return res.status(400).json({ message: "category not found " });
    }

    const row = await mdb.collection(COLLECTION_NAMES.CATEGORY).updateOne(
      { _id: existingCategory._id },
      {
        $set: {
          categoryName: category.categoryName,
          parentCategoryId:
            category.parentCategoryId || existingCategory.parentCategoryId,
        },
      },
    );
    logger.info(row, "category updated successfully with id: " + categoryId);
    return res.status(200).json(row);
  } catch (error) {
    logger.error("error updating category: " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const addCategory = async function (req, res) {
  try {
    const role = req.user.role;
    const category = req.body.category;

    console.log(role, "inside add category");

    console.log(category, "inside add category ");

    const authRole = "admin";

    if (role != authRole) {
      logger.error("user must be admin to add category");
      return res.status(400).json({ message: "user must be admin" });
    }

    // const [existingCategory] = await db.execute(
    //   `select * from categories where category_name = ?`,
    //   [category.category_name],
    // );
    const existingCategory = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .findOne({ categoryName: category.categoryName });
    console.log(existingCategory, "existing  category");

    if (existingCategory) {
      logger.error(
        "category already exists with name: " + category.categoryName,
      );
      return res.status(400).json({ message: "category already exists" });
    }

    const row = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .insertOne(category);

    logger.info("category added successfully");
    console.log(row, " row ");

    return res
      .status(200)
      .json({ message: "category added successfully ", response: row });
  } catch (error) {
    logger.error("error adding category: " + error.message);
    return res.status(500).json({ message: " inside add category " + error });
  }
};

const deleteCategory = async function (req, res) {
  try {
    const role = req.user.role;
    const categoryId = req.params.id;

    console.log(role, "inside get category...");

    const authRole = "admin";

    if (role != authRole) {
      logger.error("user must be admin to delete category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const existingCategory = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .findOne({ _id: new ObjectId(categoryId) });

    if (!existingCategory) {
      logger.error(" category not found with id: " + categoryId);
      return res.status(400).json({ message: " category not found " });
    }

    console.log(existingCategory, "inside get category..");

    const response = await mdb
      .collection(COLLECTION_NAMES.CATEGORY)
      .deleteOne({ _id: existingCategory._id });

    logger.info("category deleted successfully with id: " + categoryId);

    return res.status(200).json({ message: "category deleted ", response });
  } catch (error) {
    logger.error("error deleting category: " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

//vendors
const getAllVendors = async function (req, res) {
  try {
    const role = req.user.role;
    const userId = req.userId;
    const authRole = "admin";

    if (role != authRole) {
      logger.warn(`user with id ${userId} tried to access getAllVendors`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const vendors = await mdb
      .collection(COLLECTION_NAMES.VENDOR)
      .find({})
      .toArray();

    logger.info(" vendor data fetched ");
    return res.status(200).json(vendors);
  } catch (error) {
    logger.error("error getting all vendors : " + error.message);
    return res.status(500).json({ message: error.message });
  }
};
// customers
const getAllCustomers = async function (req, res) {
  try {
    const role = req.user.role;
    const userId = req.userId;

    const authRole = "admin";

    if (role != authRole) {
      logger.warn(`user with id ${userId} tried to access getAllCustomers`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const customers = await mdb
      .collection(COLLECTION_NAMES.CUSTOMER)
      .find({})
      .toArray();

    logger.info("customers data fetched");
    return res.status(200).json(customers);
  } catch (error) {
    logger.error("error getting all vendors : " + error.message);
    return res.status(500).json({ message: error.message });
  }
};
// orders
const getAllOrders = async function (req, res) {
  try {
    const role = req.user.role;
    const userId = req.userId;

    const authRole = "admin";

    if (role != authRole) {
      logger.warn(`user with id ${userId} tried to access getAllOrders`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const orders = await mdb
      .collection(COLLECTION_NAMES.ORDER)
      .find({})
      .toArray();

    logger.info("orders data fetched");
    return res.status(200).json(orders);
  } catch (error) {
    logger.error("error getting all vendors : " + error.message);
    return res.status(500).json({ message: error.message });
  }
};
// payments
const getAllPayments = async function (req, res) {
  try {
    const role = req.user.role;
    const userId = req.userId;

    const authRole = "admin";

    if (role != authRole) {
      logger.warn(`user with id ${userId} tried to access getAllPayments`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const payments = await mdb
      .collection(COLLECTION_NAMES.PAYMENT)
      .find({})
      .toArray();

    logger.info("payments data fetched");
    return res.status(200).json(payments);
  } catch (error) {
    logger.error("error getting all vendors : " + error.message);
    return res.status(500).json({ message: error.message });
  }
};

export {
  getAllCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllVendors,
  getAllCustomers,
  getAllOrders,
  getAllPayments,
};
