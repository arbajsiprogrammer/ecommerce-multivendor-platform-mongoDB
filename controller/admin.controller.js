import logger from "../service/log.service.js";
import { db } from "../util/db.util.js";

// categories
const getAllCategories = async function (req, res) {
  try {
    const role = req.user.role;

    console.log(role, "inside get all categories...");

    if (role !== "admin") {
      logger.error("user must be admin to access categories");
      return res.status(400).json({ message: "user must be admin" });
    }

    const [categories] = await db.execute(`select * from categories`);

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

    if (role !== "admin") {
      logger.error("user must be admin to access category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const [category] = await db.execute(
      `select * from categories where id = ?`,
      [categoryId],
    );

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
    if (role !== "admin") {
      logger.error("user must be admin to update category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const [existing_category] = await db.execute(
      `select * from categories where id = ?`,
      [categoryId],
    );
    console.log(existing_category, "inside get category..");

    if (existing_category.length == 0) {
      logger.error("category not found with id: " + categoryId);
      return res.status(400).json({ message: "category not found " });
    }
    const [row] = await db.execute(
      `update categories set category_name = ?, parent_category_id = ? where id = ?`,
      [
        category.category_name,
        category.parent_category_id || existing_category[0].parent_category_id,
        categoryId,
      ],
    );
    logger.info("category updated successfully with id: " + categoryId);
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

    if (role != "admin") {
      logger.error("user must be admin to add category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const [existing_category] = await db.execute(
      `select * from categories where category_name = ?`,
      [category.category_name],
    );
    console.log(existing_category, "existing  category");

    if (existing_category.length > 0) {
      logger.error(
        "category already exists with name: " + category.category_name,
      );
      return res.status(400).json({ message: "category already exists" });
    }

    const [row] = await db.execute(
      `insert into categories (category_name, parent_category_id) values (?,?)`,
      [category.category_name || "temp", category.parent_category_id || null],
    );

    logger.info("category added successfully");
    console.log(row, "row ");

    return res.status(200).json({ message: "category added successfully " });
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

    if (role !== "admin") {
      logger.error("user must be admin to delete category");
      return res.status(400).json({ message: "user must be admin" });
    }

    const [category] = await db.execute(
      `select * from categories where id = ?`,
      [categoryId],
    );

    if (category.length == 0) {
      logger.error("category not found with id: " + categoryId);
      return res.status(400).json({ message: " category not found " });
    }

    console.log(category, "inside get category..");

    const [row] = await db.execute(`delete from categories where id = ?`, [
      categoryId,
    ]);

    logger.info("category deleted successfully with id: " + categoryId);

    return res.status(200).json(category);
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

    if (role != "admin") {
      logger.warn(`user with id ${userId} tried to access getAllVendors`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const [vendors] = await db.execute(`select * from vendors`);
    logger.info("vendor data fetched");
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

    if (role != "admin") {
      logger.warn(`user with id ${userId} tried to access getAllCustomers`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const [customers] = await db.execute(`select * from customers`);
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

    if (role != "admin") {
      logger.warn(`user with id ${userId} tried to access getAllOrders`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const [orders] = await db.execute(`select * from orders`);
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

    if (role != "admin") {
      logger.warn(`user with id ${userId} tried to access getAllPayments`);
      return res.status(400).json({ message: "you are not allowed" });
    }

    const [payments] = await db.execute(`select * from payments`);
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
