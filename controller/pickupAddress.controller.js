import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addPickupAddressService,
  deletePickupAddressService,
  updatePickupAddressService,
} from "../service/pickupAddress.service.js";

// add pickup address
const addPickupAddress = async (req, res) => {
  try {
    const response = await addPickupAddressService(req.user, req.body);

    successResponse(res, 200, "Pickup address added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getPickupAddress = async (req, res) => {
  try {
    const pickupAddresses = await getPickupAddressService(req.user._id);

    successResponse(
      res,
      200,
      "Pickup addresses fetched successfully",
      pickupAddresses,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const updatePickupAddress = async (req, res) => {
  try {
    const response = await updatePickupAddressService(
      req.user._id,
      req.params.id,
      req.body,
    );

    successResponse(res, 200, "Pickup address updated successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const deletePickupAddress = async (req, res) => {
  try {
    const response = await deletePickupAddressService(
      req.user._id,
      req.params.id,
    );

    successResponse(res, 200, "Pickup address deleted successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export {
  addPickupAddress,
  getPickupAddress,
  deletePickupAddress,
  updatePickupAddress,
};
