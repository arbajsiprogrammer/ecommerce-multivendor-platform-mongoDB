import {
  removeDeliveryAddress,
  updateDeliveryAddressHelper,
  validateDeliveryAddressExists,
} from "../helper/address.helper.js";
import {
  getCustomerByIdRepository,
  updateDeliveryAddressesRepository,
} from "../repository/DeliveryAddress.repository.js";

const addDeliveryAddressService = async (user, body) => {
  const CustomerId = user._id;

  const address = {
    ...body,
    id: body.id || crypto.randomUUID(),
  };

  const Customer = await getCustomerByIdRepository(CustomerId);

  const DeliveryAddresses = [...Customer.DeliveryAddresses, address];

  const response = await updateDeliveryAddressesRepository(
    CustomerId,
    DeliveryAddresses,
  );

  return response;
};

const getDeliveryAddressService = async (CustomerId) => {
  const Customer = await getCustomerByIdRepository(CustomerId);

  return Customer.DeliveryAddresses || [];
};

const updateDeliveryAddressService = async (
  CustomerId,
  DeliveryAddressId,
  addressData,
) => {
  const Customer = await getCustomerByIdRepository(CustomerId);

  validateDeliveryAddressExists(Customer.DeliveryAddresses, DeliveryAddressId);

  const updatedAddresses = updateDeliveryAddressHelper(
    Customer.DeliveryAddresses,
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

  validateDeliveryAddressExists(Customer.DeliveryAddresses, DeliveryAddressId);

  const updatedAddresses = removeDeliveryAddress(
    Customer.DeliveryAddresses,
    DeliveryAddressId,
  );

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
