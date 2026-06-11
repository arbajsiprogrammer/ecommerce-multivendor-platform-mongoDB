import { errorResponse } from "../helper/response.helper.js";
import { productSchema } from "../model/productSchema.model.js";

const validateVendorRole = async (req, res, next) => {
  try {
    const user = req.user || req.body;

    if (user.role != "vendor") {
      return res.status(400).json({
        message: "Invalid role",
      });
      return errorResponse(res, 400, "Invalid role");
    }
    next();
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const validateProduct = async (req, res, next) => {
  try {
    const product = req.body;

    if (!product) {
      return errorResponse(res, 400, "Product details missing in request body");
    }

    const result = productSchema.validate({
      product_name: product.productName,
      price: product.productSkuses[0].price,
    });

    if (result.error) {
      return errorResponse(
        res,
        400,
        `Product validation failed: ${result.error.details[0].message}`,
      );
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
export { validateVendorRole, validateProduct };
