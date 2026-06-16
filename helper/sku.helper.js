import logger from "../service/log.service.js";
import { ApiError } from "../util/ApiError.util.js";

const deleteImageHelper = (existingProduct, skuId, imageId) => {
  const tempSku = existingProduct[0].productSkuses;

  const updatedSkus = tempSku.map((sku) => {
    if (sku.id == skuId) {
      const updatedImages = sku.images.filter((image) => image.id != imageId);
      sku.images = updatedImages;
    }
    return sku;
  });

  return updatedSkus;
};

const getImageHelper = (existingProduct, skuId) => {
  const tempSku = existingProduct[0].productSkuses;
  console.log(tempSku, "tempSku");
  const sku = tempSku.filter((sku) => sku.id == skuId);
  console.log(sku, "sku");
  if (sku.length == 0) {
    throw new ApiError(400, "sku not found with id ", skuId);
  }
  const images = sku[0]?.images;
  return images;
};

const addImageHelper = (existingProduct, skuId, imgId, imageUrl) => {
  const tempSku = existingProduct[0].productSkuses;

  const updatedSkus = tempSku.map((sku) => {
    if (sku.id == skuId) {
      sku.images.push({
        id: imgId,
        imageUrl,
      });
    }
    return sku;
  });
  return updatedSkus;
};
const deleteSkuHelper = (existingProduct, skuId) => {
  const tempSku = existingProduct[0].productSkuses;

  const updateProductSkus = tempSku.filter((sku) => sku.id != skuId);

  return updateProductSkus;
};

const updateSkuHelper = (existingProduct, skuId, productSku) => {
  const tempSkus = existingProduct[0].productSkuses;
  const updatedSkus = tempSkus.map((sku) => {
    logger.info(`${sku.id} : ${skuId}`);
    if (sku.id == skuId) {
      return productSku;
    } else {
      return sku;
    }
  });
  return updatedSkus;
};
// const checkStockHelper = (productSku) => {
//   if (productSku.availableStock < quantity || !productSku.availabilityStatus) {
//     throw new Error(
//       "Product is out of stock or quantity is grater than available stock ",
//     );
//   }
//   return true;
// };
// const addToCartHelper = (existingCart, productId, skuId) => {
//   // check if quantity is grater than the available stock or if product is out of stock

//   checkStockHelper(productSku);

//   // if current product sku is already exist
//   isSkuExistHelper();
//   let existingProductSku;
//   if (existingCart.cartItems && existingCart.cartItems.length > 0) {
//     existingProductSku = existingCart.cartItems.filter(
//       (item) => item.productSkusId == skuId,
//     );
//   }

//   if (existingProductSku && existingProductSku.length > 0) {
//     throw new Error("Product is already in cart");
//   }

//   return true;
// };
export {
  deleteImageHelper,
  getImageHelper,
  addImageHelper,
  deleteSkuHelper,
  updateSkuHelper,
};
