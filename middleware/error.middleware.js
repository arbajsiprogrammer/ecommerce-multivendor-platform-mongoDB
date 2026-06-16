import { errorResponse } from "../helper/response.helper.js";

const errorMiddleware = (error, req, res, next) => {
  return errorResponse(res, error.statusCode || 500, error);
};

export { errorMiddleware };
