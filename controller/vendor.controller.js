import { errorResponse, successResponse } from "../helper/response.helper.js";
import { getAllVendorsService } from "../service/vendor.service.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

//vendors
const getAllVendors = asyncHandler(async function (req, res) {
  const vendors = await getAllVendorsService();

  successResponse(res, 200, "vendor data fetched", vendors);
});
export { getAllVendors };
