const updateAddressHelper = (addresses, addressId, addressData) => {
  const updatedAddresses = addresses.map((address) => {
    if (address.id == addressId) {
      return {
        ...address,
        ...addressData,
      };
    } else return address;
  });

  return updatedAddresses;
};

const validateAddressExists = (addresses, addressId) => {
  const exists = addresses.some((address) => address.id == addressId);

  if (!exists) {
    throw new Error("  address not found");
  }
};

const removeAddress = (addresses, addressId) => {
  return addresses.filter((address) => address.id !== addressId);
};

export { updateAddressHelper, validateAddressExists, removeAddress };
