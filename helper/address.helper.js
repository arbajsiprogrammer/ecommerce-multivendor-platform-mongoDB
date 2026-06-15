const updatePickupAddressHelper = (
  pickupAddresses,
  pickupAddressId,
  addressData,
) => {
  const updatedPickupAddresses = pickupAddresses.map((address) => {
    if (address.id == pickupAddressId) {
      return {
        ...address,
        ...addressData,
      };
    } else return address;
  });

  return updatedPickupAddresses;
};

const validatePickupAddressExists = (pickupAddresses, pickupAddressId) => {
  const exists = pickupAddresses.some(
    (address) => address.id === pickupAddressId,
  );

  if (!exists) {
    throw new Error("Pickup address not found");
  }
};

const removePickupAddress = (pickupAddresses, pickupAddressId) => {
  return pickupAddresses.filter((address) => address.id !== pickupAddressId);
};

export {
  updatePickupAddressHelper,
  validatePickupAddressExists,
  removePickupAddress,
};
