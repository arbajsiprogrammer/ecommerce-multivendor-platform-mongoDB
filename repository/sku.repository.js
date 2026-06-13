import { ObjectId } from "mongodb";
import COLLECTION from "../Constants/collectionName.constant.js";
import { mdb } from "../util/db.util.js";

const updateProductSku = async (updatedSkus, productId) => {
  const response = await mdb
    .collection(COLLECTION.PRODUCT)
    .updateOne(
      { _id: new ObjectId(productId) },
      { $set: { productSkuses: updatedSkus } },
    );

  return response;
};

export { updateProductSku };
