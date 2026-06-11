import { ObjectId } from "mongodb";
import { mdb } from "../util/db.util.js";
import COLLECTION from "../Constants/collectionName.constant.js";

const getExistingProduct = async (vendorId, productId) => {
  const existingProduct = await mdb
    .collection(COLLECTION.PRODUCT)
    .find({ vendorId: vendorId, _id: new ObjectId(productId) })
    .toArray();

  return existingProduct;
};

const updateProductSku = async (tempSkus, skuId, productId) => {
  const updatedSkus = tempSkus.map((sku) => {
    if (sku.id == skuId) {
      return productSku;
    } else {
      return sku;
    }
  });

  const response = await mdb
    .collection(COLLECTION.PRODUCT)
    .updateOne(
      { _id: new ObjectId(productId) },
      { $set: { productSkuses: updatedSkus } },
    );
  return response;
};
export { getExistingProduct, updateProductSku };
