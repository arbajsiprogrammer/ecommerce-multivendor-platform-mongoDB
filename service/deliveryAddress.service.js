import {
  removeAddress,
  updateAddressHelper,
  validateAddressExists,
} from "../helper/address.helper.js";
import {
  getCustomerByIdRepository,
  updateDeliveryAddressesRepository,
} from "../repository/deliveryAddress.repository.js";

const addDeliveryAddressService = async (user, body) => {
  const CustomerId = user._id;

  const address = {
    ...body,
    id: body.id || crypto.randomUUID(),
  };

  const Customer = await getCustomerByIdRepository(CustomerId);
  console.log(Customer);
  //   const existingAddress = Customer.addresses || [];
  const DeliveryAddresses = [...Customer.addresses, address];

  const response = await updateDeliveryAddressesRepository(
    CustomerId,
    DeliveryAddresses,
  );

  return response;
};

const getDeliveryAddressService = async (CustomerId) => {
  const Customer = await getCustomerByIdRepository(CustomerId);

  return Customer.addresses || [];
};

const updateDeliveryAddressService = async (
  CustomerId,
  DeliveryAddressId,
  addressData,
) => {
  const Customer = await getCustomerByIdRepository(CustomerId);

  validateAddressExists(Customer.addresses, DeliveryAddressId);

  const updatedAddresses = updateAddressHelper(
    Customer.addresses,
    DeliveryAddressId,
    addressData,
  );

  const response = await updateDeliveryAddressesRepository(
    CustomerId,
    updatedAddresses,
  );
  return response;
};

const deleteDeliveryAddressService = async (CustomerId, DeliveryAddressId) => {
  const Customer = await getCustomerByIdRepository(CustomerId);

  validateAddressExists(Customer.addresses, DeliveryAddressId);

  const updatedAddresses = removeAddress(Customer.addresses, DeliveryAddressId);

  const response = await updateDeliveryAddressesRepository(
    CustomerId,
    updatedAddresses,
  );
  return response;
};
export {
  addDeliveryAddressService,
  getDeliveryAddressService,
  updateDeliveryAddressService,
  deleteDeliveryAddressService,
};
