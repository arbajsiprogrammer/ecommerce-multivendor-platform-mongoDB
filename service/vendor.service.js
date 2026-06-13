import COLLECTION from "../Constants/collectionName.constant.js";
import { find } from "../repository/common.repository.js";

const getAllVendorsService = async () => {
  const response = await find(COLLECTION.PLATFORM_USER, {});
  return response;
};

export { getAllVendorsService };
