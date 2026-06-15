import { errorResponse, successResponse } from "../helper/response.helper.js";
import {
  addDeliveryAddressService,
  deleteDeliveryAddressService,
  getDeliveryAddressService,
  updateDeliveryAddressService,
} from "../service/deliveryAddress.service.js";

// add Delivery address
const addDeliveryAddress = async (req, res) => {
  try {
    const response = await addDeliveryAddressService(req.user, req.body);

    successResponse(res, 200, "Delivery address added successfully", response);
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const getDeliveryAddress = async (req, res) => {
  try {
    const DeliveryAddresses = await getDeliveryAddressService(req.user._id);

    successResponse(
      res,
      200,
      "Delivery addresses fetched successfully",
      DeliveryAddresses,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const updateDeliveryAddress = async (req, res) => {
  try {
    const response = await updateDeliveryAddressService(
      req.user._id,
      req.params.id,
      req.body,
    );

    successResponse(
      res,
      200,
      "Delivery address updated successfully",
      response,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

const deleteDeliveryAddress = async (req, res) => {
  try {
    const response = await deleteDeliveryAddressService(
      req.user._id,
      req.params.id,
    );

    successResponse(
      res,
      200,
      "Delivery address deleted successfully",
      response,
    );
  } catch (error) {
    errorResponse(res, 500, error);
  }
};

export {
  addDeliveryAddress,
  getDeliveryAddress,
  deleteDeliveryAddress,
  updateDeliveryAddress,
};
