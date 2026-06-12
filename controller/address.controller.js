import { ObjectId } from "mongodb";
import logger from "../service/log.service.js";
import { db, mdb } from "../util/db.util.js";

// add pickup address
const addPickupAddress = async function (req, res) {
  try {
    const { address, state, city, pinCode } = req.body;
    const addressId = req.body.id || Date.now().toString();

    const vendorId = req.user._id;
    const role = req.user.role;

    if (role !== "vendor") {
      logger.warn(
        `User with id ${vendorId} and role ${role} tried to add pickup address`,
      );
      return res
        .status(403)
        .json({ message: "Only vendor can add pickup address" });
    }
    const vendorData = await mdb
      .collection(COLLECTION.VENDOR)
      .findOne({ _id: new ObjectId(vendorId) });

    const pickupAddress = vendorData.pickupAddresses;
    pickupAddress.push({ ...req.body, id: addressId });

    console.log("pickupAddress");
    console.log(pickupAddress);

    const response = await mdb
      .collection(COLLECTION.VENDOR)
      .updateOne(
        { _id: new ObjectId(vendorId) },
        { $set: { pickupAddresses: pickupAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Pickup address added successfully for vendor with id ${vendorId}`,
    ); // Log successful addition of pickup address
    return res
      .status(200)
      .json({ message: "Pickup address added successfully" });
  } catch (error) {
    logger.error(`Error adding pickup address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// get pickup address
const getPickupAddress = async function (req, res) {
  try {
    const vendorId = req.user._id;
    const role = req.user.role;

    if (role !== "vendor") {
      logger.warn(
        `User with id ${vendorId} and role ${role} tried to get pickup address`,
      );
      return res
        .status(403)
        .json({ message: "Only vendor can get pickup address" });
    }

    const vendorData = await mdb
      .collection(COLLECTION.VENDOR)
      .findOne({ _id: new ObjectId(vendorId) });
    const pickupAddress = vendorData.pickupAddresses;
    console.log("pickupAddress");
    console.log(pickupAddress);
    logger.info(
      `Pickup addresses retrieved successfully for vendor with id ${vendorId}`,
    );
    // Log successful retrieval of pickup addresses
    return res.status(200).json(pickupAddress);
  } catch (error) {
    logger.error(`Error retrieving pickup addresses: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// update pickup address
const updatePickupAddress = async function (req, res) {
  try {
    const { address, state, city, pinCode } = req.body;
    const addressId = req.body.id || Date.now().toString();

    const vendorId = req.user._id;
    const role = req.user.role;
    const pickupAddressId = req.params.id;

    if (role !== "vendor") {
      logger.warn(
        `User with id ${vendorId} and role ${role} tried to update pickup address with id ${pickupAddressId}`,
      );

      return res
        .status(403)
        .json({ message: "Only vendor can update pickup address" });
    }

    const vendorData = await mdb
      .collection(COLLECTION.VENDOR)
      .findOne({ _id: new ObjectId(vendorId) });

    const pickupAddress = vendorData.pickupAddresses;

    const newPickupAddress = pickupAddress.map((address) => {
      if (address.id == pickupAddressId) {
        return { id: address.id, ...req.body };
      } else {
        return address;
      }
    });

    console.log("pickupAddress");
    console.log(pickupAddress);

    const response = await mdb
      .collection(COLLECTION.VENDOR)
      .updateOne(
        { _id: new ObjectId(vendorId) },
        { $set: { pickupAddresses: newPickupAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Pickup address with id ${pickupAddressId} updated successfully for vendor with id ${vendorId}`,
    ); // Log successful update of pickup address
    return res
      .status(200)
      .json({ message: "Pickup address updated successfully" });
  } catch (error) {
    logger.error(`Error updating pickup address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// delete pickup address
const deletePickupAddress = async function (req, res) {
  try {
    const vendorId = req.user._id;
    const role = req.user.role;
    const pickupAddressId = req.params.id;

    if (role != "vendor" && role != "admin") {
      return res
        .status(403)
        .json({ message: "Only vendor can delete pickup address" });
    }
    const vendorData = await mdb
      .collection(COLLECTION.VENDOR)
      .findOne({ _id: new ObjectId(vendorId) });

    const pickupAddress = vendorData.pickupAddresses;

    const newPickupAddress = pickupAddress.filter(
      (address) => address.id != pickupAddressId,
    );

    console.log("newPickupAddress");
    console.log(newPickupAddress);

    const response = await mdb
      .collection(COLLECTION.VENDOR)
      .updateOne(
        { _id: new ObjectId(vendorId) },
        { $set: { pickupAddresses: newPickupAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Pickup address with id ${pickupAddressId} deleted successfully for vendor with id ${vendorId}`,
    ); // Log successful deletion of pickup address
    return res
      .status(200)
      .json({ message: "Pickup address deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting pickup address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// delivery address (customers delivery address)
// add delivery address
const addDeliveryAddress = async function (req, res) {
  try {
    const { address, state, city, pinCode } = req.body;
    const addressId = req.body.id || Date.now().toString();

    const customerId = req.user._id;
    const role = req.user.role;

    if (role !== "customer") {
      logger.warn(
        `User with id ${customerId} and role ${role} tried to add delivery address`,
      );
      return res
        .status(403)
        .json({ message: "Only customer can add delivery address" });
    }
    const customerData = await mdb
      .collection(COLLECTION.CUSTOMER)
      .findOne({ _id: new ObjectId(customerId) });

    const deliveryAddress = customerData.deliveryAddresses;
    deliveryAddress.push({ id: addressId, ...req.body });

    console.log("deliveryAddress");
    console.log(deliveryAddress);

    const response = await mdb
      .collection(COLLECTION.CUSTOMER)
      .updateOne(
        { _id: new ObjectId(customerId) },
        { $set: { deliveryAddresses: deliveryAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Delivery address added successfully for customer with id ${customerId}`,
    ); // Log successful addition of delivery address
    return res
      .status(200)
      .json({ message: "Delivery address added successfully" });
  } catch (error) {
    logger.error(`Error adding delivery address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// get delivery address
const getDeliveryAddress = async function (req, res) {
  try {
    const customerId = req.user._id;
    const role = req.user.role;

    if (role != "customer" && role != "admin") {
      logger.warn(
        `User with id ${customerId} and role ${role} tried to get delivery address`,
      );
      return res
        .status(403)
        .json({ message: "Only customer can get delivery address" });
    }

    const customerData = await mdb
      .collection(COLLECTION.CUSTOMER)
      .findOne({ _id: new ObjectId(customerId) });
    const deliveryAddress = customerData.deliveryAddresses;

    console.log("deliveryAddress");
    console.log(deliveryAddress);

    logger.info(
      `Delivery addresses retrieved successfully for customer with id ${customerId}`,
    ); // Log successful retrieval of delivery addresses
    return res.status(200).json(deliveryAddress);
  } catch (error) {
    logger.error(`Error retrieving delivery addresses: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// update delivery address
const updateDeliveryAddress = async function (req, res) {
  try {
    const { address, state, city, pinCode } = req.body;
    const addressId = req.body.id || Date.now().toString();

    const customerId = req.user._id;
    const role = req.user.role;
    const deliveryAddressId = req.params.id;

    if (role !== "customer") {
      logger.warn(
        `User with id ${customerId} and role ${role} tried to add delivery address`,
      );
      return res
        .status(403)
        .json({ message: "Only customer can add delivery address" });
    }
    const customerData = await mdb
      .collection(COLLECTION.CUSTOMER)
      .findOne({ _id: new ObjectId(customerId) });

    const deliveryAddress = customerData.deliveryAddresses;
    // deliveryAddress.push({ id: addressId, ...req.body });
    const newDeliveryAddress = deliveryAddress.map((address) => {
      if (address.id == deliveryAddressId) {
        return { id: address.id, ...req.body };
      } else {
        return address;
      }
    });

    console.log("deliveryAddress");
    console.log(deliveryAddress);

    const response = await mdb
      .collection(COLLECTION.CUSTOMER)
      .updateOne(
        { _id: new ObjectId(customerId) },
        { $set: { deliveryAddresses: newDeliveryAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Delivery address added successfully for customer with id ${customerId}`,
    ); // Log successful addition of delivery address
    return res
      .status(200)
      .json({ message: "Delivery address added successfully" });
  } catch (error) {
    logger.error(`Error adding delivery address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

// delete delivery address
const deleteDeliveryAddress = async function (req, res) {
  try {
    const customerId = req.user._id;
    const role = req.user.role;
    const deliveryAddressId = req.params.id;

    if (role !== "customer") {
      logger.warn(
        `User with id ${customerId} and role ${role} tried to add delivery address`,
      );
      return res
        .status(403)
        .json({ message: "Only customer can add delivery address" });
    }
    const customerData = await mdb
      .collection(COLLECTION.CUSTOMER)
      .findOne({ _id: new ObjectId(customerId) });

    const deliveryAddress = customerData.deliveryAddresses;
    // deliveryAddress.push({ id: addressId, ...req.body });
    const newDeliveryAddress = deliveryAddress.filter(
      (address) => address.id != deliveryAddressId,
    );

    console.log("deliveryAddress");
    console.log(deliveryAddress);

    const response = await mdb
      .collection(COLLECTION.CUSTOMER)
      .updateOne(
        { _id: new ObjectId(customerId) },
        { $set: { deliveryAddresses: newDeliveryAddress } },
      );

    console.log("response");
    console.log(response);

    logger.info(
      `Delivery address deleted successfully for customer with id ${customerId}`,
    ); // Log successful addition of delivery address
    return res
      .status(200)
      .json({ message: "Delivery address added successfully" });
  } catch (error) {
    logger.error(`Error adding delivery address: ${error}`); // Log error message
    console.error(error);
    return res.status(500).json({ message: " Internal server error " });
  }
};
export {
  addPickupAddress,
  getPickupAddress,
  updatePickupAddress,
  deletePickupAddress,
  addDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
};
