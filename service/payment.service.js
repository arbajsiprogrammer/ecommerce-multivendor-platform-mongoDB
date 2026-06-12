import COLLECTION from "../Constants/collectionName.constant.js";

const getAllPaymentsService = async () => {
  const response = await find(COLLECTION.PAYMENT, {});
  return response;
};

export { getAllPaymentsService };
