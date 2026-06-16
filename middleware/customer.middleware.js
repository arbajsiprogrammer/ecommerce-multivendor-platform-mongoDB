import { ApiError } from "../util/ApiError.util.js";

const validateCustomerRole = async (req, res, next) => {
  const user = req.user || req.body;

  if (user.role != "customer") {
    throw new ApiError(400, "Invalid role");
  }
  next();
};

export { validateCustomerRole };
