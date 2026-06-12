import COLLECTION from "../Constants/collectionName.constant.js";
import { find } from "../repository/common.repository.js";

const getAllCustomersService = async () => {
  const response = await find(COLLECTION.CUSTOMER, {});
  return response;
};

export { getAllCustomersService };
