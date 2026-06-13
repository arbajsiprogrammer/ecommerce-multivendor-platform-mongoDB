import { errorResponse } from "../helper/response.helper.js";

const validateCustomerRole = async (req, res, next) => {
  try {
    const user = req.user || req.body;

    if (user.role != "customer") {
      return errorResponse(res, 400, "Invalid role");
    }
    next();
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

export { validateCustomerRole };
