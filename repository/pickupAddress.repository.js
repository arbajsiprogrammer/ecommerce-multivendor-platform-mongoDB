import { findById } from "./common.repository.js";

const getVendorByIdRepository = async (vendorId) => {
  const response = await findById(COLLECTION.VENDOR, {
    _id: vendorId,
  });
  return response;
};

const updatePickupAddressesRepository = async (vendorId, pickupAddresses) => {
  const response = await updateOne(
    COLLECTION.VENDOR,
    {
      _id: new ObjectId(vendorId),
    },
    {
      pickupAddresses,
    },
  );
  return response;
};

export { getVendorByIdRepository, updatePickupAddressesRepository };
