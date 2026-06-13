import { errorResponse, successResponse } from "../helper/response.helper.js";
import { getAllVendorsService } from "../service/vendor.service.js";

//vendors
const getAllVendors = async function (req, res) {
  try {
    const vendors = await getAllVendorsService();

    successResponse(res, 200, "vendor data fetched", vendors);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};
export { getAllVendors };
