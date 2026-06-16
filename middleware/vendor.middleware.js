import { errorResponse } from "../helper/response.helper.js";
import { productSchema } from "../model/productSchema.model.js";
import { ApiError } from "../util/ApiError.util.js";

const validateVendorRole = async (req, res, next) => {
  const user = req.user || req.body;

  if (user.role != "vendor") {
    throw new ApiError(400, "Invalid role");
  }
  next();
};

const validateProduct = async (req, res, next) => {
  const product = req.body;

  if (!product) {
    throw new ApiError(400, "Product details missing in request body");
  }

  const result = productSchema.validate({
    product_name: product.productName,
    price: product.productSkuses[0].price,
  });

  if (result.error) {
    throw new ApiError(
      400,
      `Product validation failed: ${result.error.details[0].message}`,
    );
  }

  next();
};
export { validateVendorRole, validateProduct };
