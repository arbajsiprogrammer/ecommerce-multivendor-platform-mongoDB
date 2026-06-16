import logger from "../service/log.service.js";
import { ApiError } from "../util/ApiError.util.js";
import { ApiResponse } from "../util/ApiResponse.util.js";

const successResponse = function (res, statusCode, message, data) {
  logger.info(
    JSON.stringify({
      success: true,
      statusCode: statusCode,
      message: message,
      data: data,
    }),
  );
  // return res.status(statusCode).json({
  //   success: true,
  //   statusCode: statusCode,
  //   message: message,
  //   data: data,
  // });

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};

const errorResponse = function (res, statusCode, error) {
  logger.error(
    JSON.stringify({
      success: false,
      statusCode: statusCode,
      message: error?.message || error,
      stack: error.stack,
      data: null,
    }),
  );
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: error.message || error,
    data: null,
  });
};

export { successResponse, errorResponse };
