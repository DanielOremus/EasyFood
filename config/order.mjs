export default Object.freeze({
  pointRate: 0.5,
  maxPointSalePercentage: 0.2,
  paymentMethods: ["card", "cash"],
  statuses: {
    PENDING: "pending",
    PREPARING: "preparing",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },
})
