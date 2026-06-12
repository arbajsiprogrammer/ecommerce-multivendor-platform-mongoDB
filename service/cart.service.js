import COLLECTION from "../Constants/collectionName.constant.js";
import { errorResponse } from "../helper/response.helper";

const getExistingCart = async (customerId) => {
  const existingCart = await mdb
    .collection(COLLECTION.CART)
    .findOne({ customerId });

  if (!existingCart) {
    throw new Error("cart not found");
  }
  return existingCart;
};

const validateAddToCart = async (productId) => {
  // check if product skus is available or not in the inventory
  const product = await mdb
    .collection(COLLECTION.PRODUCT)
    .findOne({ _id: new ObjectId(productId) });

  if (!product) {
    throw new Error("product not found");
  }

  const productSku = product.productSkuses.filter((sku) => sku.id == skuId)[0];

  // check if quantity is grater than the available stock or if product is out of stock
  if (productSku.availableStock < quantity || !productSku.availabilityStatus) {
    throw new Error(
      "Product is out of stock or quantity is grater than available stock ",
    );
  }

  // if current product sku is already exist
  let existingProductSku;
  if (existingCart.cartItems && existingCart.cartItems.length > 0) {
    existingProductSku = existingCart.cartItems.filter(
      (item) => item.productSkusId == skuId,
    );
  }

  if (existingProductSku && existingProductSku.length > 0) {
    throw new Error("Product is already in cart");
  }
};

const addProductToCart = async (customerId, newCartItems) => {
  // add product sku
  const response = await mdb.collection(COLLECTION.CART).updateOne(
    { customerId },
    {
      $set: {
        cartItems: [...newCartItems],
      },
    },
  );
  return response;
};
export { getExistingCart, validateAddToCart, addProductToCart };
