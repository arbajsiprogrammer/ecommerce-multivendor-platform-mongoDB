import { errorResponse } from "../helper/response.helper.js";

const checkRole = async (req, res, next) => {
  try {
    const role = req.user.role;
    const authRole = "admin";

    if (role != authRole) {
      errorResponse(res, 400, "user must be admin to access categories");
    }

    next();
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export { checkRole };
