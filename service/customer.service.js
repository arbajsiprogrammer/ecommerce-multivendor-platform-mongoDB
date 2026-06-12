import COLLECTION from "../Constants/collectionName.constant.js";

const getAllCustomersService = async () => {
  const response = await find(COLLECTION.CUSTOMER, {});
  return response;
};

export { getAllCustomersService };
