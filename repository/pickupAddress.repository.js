import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { findOne, updateOne } from "./common.repository.js";

const getVendorByIdRepository = async (vendorId) => {
  const response = await findOne(COLLECTION.PLATFORM_USER, {
    _id: new ObjectId(vendorId),
  });
  return response;
};

const updatePickupAddressesRepository = async (vendorId, addresses) => {
  const response = await updateOne(
    COLLECTION.PLATFORM_USER,
    {
      _id: new ObjectId(vendorId),
    },
    {
      addresses,
    },
  );
  return response;
};

export { getVendorByIdRepository, updatePickupAddressesRepository };
