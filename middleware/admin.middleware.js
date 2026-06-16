import { errorResponse } from "../helper/response.helper.js";
import { ApiError } from "../util/ApiError.util.js";

const checkRole = async (req, res, next) => {
  const role = req.user.role;
  const authRole = "admin";

  if (role != authRole) {
    throw new ApiError(400, "user must be admin to access categories");
  }

  next();
};

export { checkRole };
