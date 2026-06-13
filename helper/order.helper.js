const updateOrderStatusHelper = (existingOrder) => {
  const newRecord = {
    id: orderTracksId,
    remarks,
    orderStatus: status,
  };
  const updatedOrderTracks = existingOrder.orderTracks.push(newRecord);

  return updatedOrderTracks;
};

export { updateOrderStatusHelper };
