const updateOrderStatusHelper = (existingOrder) => {
  const newRecord = {
    id: orderTracksId,
    remarks,
    orderStatus: status,
  };
  const updatedOrderTracks = existingOrder.orderTracks.push(newRecord);

  return updatedOrderTracks;
};

const validateCart = (cart) => {
  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }
};

const createOrderObject = (customerId, orderItems) => {
  const totalAmount = calculateTotalAmount(orderItems);

  const deliveryCharges = calculateDeliveryCharges(totalAmount);

  const order = {
    customerId,

    totalAmount,

    deliveryCharges,

    orderItems,

    orderTracks: [
      {
        id: crypto.randomUUID(),
        orderStatus: "CONFIRMED",
        remarks: "Order confirmed",
      },
    ],
  };

  return order;
};

const calculateTotalAmount = (orderItems) => {
  const totalAmount = orderItems.reduce(
    (total, item) => total + item.totalAmount,
    0,
  );

  return totalAmount;
};

const calculateDeliveryCharges = (totalAmount) => {
  if (totalAmount < 1000) {
    return 50;
  } else return 0;
};

const getSku = (skuArray, skuId) => {
  const existingSku = skuArray.filter((sku) => sku.id == skuId);
  return existingSku[0];
};
export {
  updateOrderStatusHelper,
  validateCart,
  createOrderObject,
  calculateTotalAmount,
  calculateDeliveryCharges,
  getSku,
};
