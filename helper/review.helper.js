const validatePurchasedProduct = (order, productId, productSkusId) => {
  const purchased = order.orderItems.some(
    (item) =>
      item.productId == productId && item.productSkusId == productSkusId,
  );

  if (!purchased) {
    throw new Error("You can only review products you purchased");
  }
};

const calculateAverageRating = (reviews) => {
  const rating = reviews.reduce((total, review) => total + review, 0);
  const averageRating = rating / reviews.length;

  return averageRating;
};

export { validatePurchasedProduct, calculateAverageRating };
