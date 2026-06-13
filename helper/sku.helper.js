import logger from "../service/log.service.js";

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
    throw new Error("sku not found with id ", skuId);
  }
  const images = sku[0]?.images;
  return images;
};

const addImageHelper = (existingProduct, skuId, imgId, imageUrl) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
};
const deleteSkuHelper = (existingProduct, skuId) => {
  try {
    const tempSku = existingProduct[0].productSkuses;

    const updateProductSkus = tempSku.filter((sku) => sku.id != skuId);

    return updateProductSkus;
  } catch (error) {
    throw new Error(error);
  }
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
export {
  deleteImageHelper,
  getImageHelper,
  addImageHelper,
  deleteSkuHelper,
  updateSkuHelper,
};
