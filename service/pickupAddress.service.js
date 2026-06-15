import {
  removeAddress,
  updateAddressHelper,
  validateAddressExists,
} from "../helper/address.helper.js";
import {
  getVendorByIdRepository,
  updatePickupAddressesRepository,
} from "../repository/pickupAddress.repository.js";

const addPickupAddressService = async (user, body) => {
  const address = {
    ...body,
    id: crypto.randomUUID(),
  };
  const vendorId = user._id;
  const vendor = await getVendorByIdRepository(vendorId);

  const pickupAddresses = [...vendor.addresses, address];

  const response = await updatePickupAddressesRepository(
    vendorId,
    pickupAddresses,
  );

  return response;
};

const getPickupAddressService = async (user) => {
  const vendorId = user._id;
  const vendor = await getVendorByIdRepository(vendorId);

  return vendor.addresses || [];
};

const updatePickupAddressService = async (
  vendorId,
  pickupAddressId,
  addressData,
) => {
  const vendor = await getVendorByIdRepository(vendorId);

  validateAddressExists(vendor.addresses, pickupAddressId);

  const updatedAddresses = updateAddressHelper(
    vendor.addresses,
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

  validateAddressExists(vendor.addresses, pickupAddressId);

  const updatedAddresses = removeAddress(vendor.addresses, pickupAddressId);

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
