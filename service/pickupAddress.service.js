import {
  removePickupAddress,
  updatePickupAddressHelper,
  validatePickupAddressExists,
} from "../helper/address.helper.js";
import {
  getVendorByIdRepository,
  updatePickupAddressesRepository,
} from "../repository/pickupAddress.repository.js";

const addPickupAddressService = async (user, body) => {
  const address = {
    ...body,
    id: body.id || crypto.randomUUID(),
  };

  const vendor = await getVendorByIdRepository(user);

  const pickupAddresses = [...vendor.pickupAddresses, address];

  const response = await updatePickupAddressesRepository(
    vendorId,
    pickupAddresses,
  );

  return response;
};

const getPickupAddressService = async (vendorId) => {
  const vendor = await getVendorByIdRepository(vendorId);

  return vendor.pickupAddresses || [];
};

const updatePickupAddressService = async (
  vendorId,
  pickupAddressId,
  addressData,
) => {
  const vendor = await getVendorByIdRepository(vendorId);

  validatePickupAddressExists(vendor.pickupAddresses, pickupAddressId);

  const updatedAddresses = updatePickupAddressHelper(
    vendor.pickupAddresses,
    pickupAddressId,
    addressData,
  );

  const response = await updatePickupAddressesRepository(
    vendorId,
    updatedAddresses,
  );
  return response;
};

const deletePickupAddressService = async (vendorId, pickupAddressId) => {
  const vendor = await getVendorByIdRepository(vendorId);

  validatePickupAddressExists(vendor.pickupAddresses, pickupAddressId);

  const updatedAddresses = removePickupAddress(
    vendor.pickupAddresses,
    pickupAddressId,
  );

  const response = await updatePickupAddressesRepository(
    vendorId,
    updatedAddresses,
  );
  return response;
};
export {
  addPickupAddressService,
  getPickupAddressService,
  updatePickupAddressService,
  deletePickupAddressService,
};
