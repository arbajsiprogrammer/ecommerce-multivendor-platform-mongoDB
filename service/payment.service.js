import COLLECTION from "../Constants/collectionName.constant.js";
import { find } from "../repository/common.repository.js";

const getAllPaymentsService = async () => {
  const response = await find(COLLECTION.PAYMENT, {});
  return response;
};

export { getAllPaymentsService };
