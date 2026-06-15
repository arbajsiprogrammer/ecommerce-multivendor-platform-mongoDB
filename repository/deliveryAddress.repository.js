import { findById } from "./common.repository.js";

const getCustomerByIdRepository = async (CustomerId) => {
  const response = await findById(COLLECTION.Customer, {
    _id: CustomerId,
  });
  return response;
};

const updateDeliveryAddressesRepository = async (
  CustomerId,
  DeliveryAddresses,
) => {
  const response = await updateOne(
    COLLECTION.Customer,
    {
      _id: new ObjectId(CustomerId),
    },
    {
      DeliveryAddresses,
    },
  );
  return response;
};

export { getCustomerByIdRepository, updateDeliveryAddressesRepository };
