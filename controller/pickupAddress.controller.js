import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addPickupAddressService,
  deletePickupAddressService,
  getPickupAddressService,
  updatePickupAddressService,
} from "../service/pickupAddress.service.js";
import { asyncHandler } from "../util/asyncHandler.util.js";

// add pickup address
const addPickupAddress = asyncHandler(async (req, res) => {
  const response = await addPickupAddressService(req.user, req.body);

  successResponse(res, 200, "Pickup address added successfully", response);
});

const getPickupAddress = asyncHandler(async (req, res) => {
  const pickupAddresses = await getPickupAddressService(req.user);

  successResponse(
    res,
    200,
    "Pickup addresses fetched successfully",
    pickupAddresses,
  );
});

const updatePickupAddress = asyncHandler(async (req, res) => {
  const response = await updatePickupAddressService(
    req.user._id,
    req.params.id,
    req.body,
  );

  successResponse(res, 200, "Pickup address updated successfully", response);
});

const deletePickupAddress = asyncHandler(async (req, res) => {
  const response = await deletePickupAddressService(
    req.user._id,
    req.params.id,
  );

  successResponse(res, 200, "Pickup address deleted successfully", response);
});

export {
  addPickupAddress,
  getPickupAddress,
  deletePickupAddress,
  updatePickupAddress,
};
