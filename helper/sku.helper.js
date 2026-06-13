const deleteImageHelper = (existingProduct) => {
  const tempSku = existingProduct[0].productSkuses;
  const sku = tempSku.filter((sku) => sku.id == skuId);

  const updatedSkus = tempSku.map((sku) => {
    if (sku.id == skuId) {
      const updatedImages = sku.images.filter((image) => image.id != imageId);
      sku.images = updatedImages;
    }
    return sku;
  });

  return updatedSkus;
};

const getImageHelper = (existingProduct) => {
  const tempSku = existingProduct[0].productSkuses;

  const sku = tempSku.filter((sku) => sku.id == skuId);
  const images = sku[0].images;
  return images;
};

const addImageHelper = (existingProduct) => {
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
  } catch (error) {
    throw new Error(error);
  }
};
const deleteSkuHelper = (existingProduct) => {
  try {
    const tempSku = existingProduct[0].productSkuses;

    const updateProductSkus = tempSkus.filter((sku) => sku.id != skuId);

    return updateProductSkus;
  } catch (error) {
    throw new Error(error);
  }
};

const updateSkuHelper = (existingProduct) => {
  const tempSkus = existingProduct[0].productSkuses;
  const updatedSkus = tempSkus.map((sku) => {
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
