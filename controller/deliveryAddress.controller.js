import { successResponse } from "../helper/response.helper.js";
import {
  addDeliveryAddressService,
  deleteDeliveryAddressService,
  getDeliveryAddressService,
  updateDeliveryAddressService,
} from "../service/deliveryAddress.service.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

// add Delivery address
const addDeliveryAddress = asyncHandler(async (req, res) => {
  const response = await addDeliveryAddressService(req.user, req.body);

  successResponse(res, 200, "Delivery address added successfully", response);
});

const getDeliveryAddress = asyncHandler(async (req, res) => {
  const DeliveryAddresses = await getDeliveryAddressService(req.user._id);

  successResponse(
    res,
    200,
    "Delivery addresses fetched successfully",
    DeliveryAddresses,
  );
});

const updateDeliveryAddress = asyncHandler(async (req, res) => {
  const response = await updateDeliveryAddressService(
    req.user._id,
    req.params.id,
    req.body,
  );

  successResponse(res, 200, "Delivery address updated successfully", response);
});

const deleteDeliveryAddress = asyncHandler(async (req, res) => {
  const response = await deleteDeliveryAddressService(
    req.user._id,
    req.params.id,
  );

  successResponse(res, 200, "Delivery address deleted successfully", response);
});

export {
  addDeliveryAddress,
  getDeliveryAddress,
  deleteDeliveryAddress,
  updateDeliveryAddress,
};
