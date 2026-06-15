import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { findOne, updateOne } from "./common.repository.js";

const getCustomerByIdRepository = async (CustomerId) => {
  const response = await findOne(COLLECTION.CUSTOMER, {
    _id: new ObjectId(CustomerId),
  });
  return response;
};

const updateDeliveryAddressesRepository = async (CustomerId, addresses) => {
  const response = await updateOne(
    COLLECTION.CUSTOMER,
    {
      _id: new ObjectId(CustomerId),
    },
    {
      addresses,
    },
  );
  return response;
};

export { getCustomerByIdRepository, updateDeliveryAddressesRepository };
