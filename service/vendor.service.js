import COLLECTION from "../Constants/collectionName.constant";
import { find } from "../repository/common.repository";

const getAllVendorsService = async () => {
  const response = await find(COLLECTION.PLATFORM_USER, {});
  return response;
};

export { getAllVendorsService };
