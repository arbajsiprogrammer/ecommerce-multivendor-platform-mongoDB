// import { db } from "../util/db.util.js";

// const addProduct = async function (req, res) {
//   try {
//     const product = req.body.product;
//     const user = req.user;
//     const userId = req.userId;

//     if (!product) {
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error });
//   }
// };
// const getAllProducts = async function (req, res) {
//   try {
//     const role = req.user.role;
//     const phone_number = req.user.phone_number;
//     const id = req.user.id;

//     let products;

//     if (role == "vendor") {
//       // showing only the vendors product
//       [products] = await db.execute(
//         `select * from products where vendor_id = ?`,
//         [id],
//       );
//     } else {
//       // showing all products
//       [products] = await db.execute(`select * from products`);
//     }
//     console.log(products, "all proucts ");
//     return res.status(200).json(products);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error });
//   }
// };

// export { getAllProducts, addProduct, getProduct };
