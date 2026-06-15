const createPaymentTracks = () => {
  const trackArray = [
    {
      id: crypto.randomUUID(),
      status: "PENDING",
    },
  ];

  return trackArray;
};

const createPaymentSplits = (orderItems) => {
  const splitArray = orderItems.map((item) => {
    const commission = item.totalAmount * 0.002;

    const split = {
      id: crypto.randomUUID(),

      vendorId: item.vendorId,

      orderItemId: item.id,

      commissionCharged: commission,

      vendorAmount: item.totalAmount - commission,
    };

    return split;
  });

  return splitArray;
};

export { createPaymentTracks, createPaymentSplits };
