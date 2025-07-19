export const formatOrderCreateResponse = (order, dishBindingObj) => {
  const resItems = order.items.map(({ dishId, quantity, price }) => ({
    dishId,
    name: dishBindingObj[dishId].name,
    quantity,
    price,
  }))
  return {
    restaurantId: order.restaurantId,
    items: resItems,
    createdAt: order.createdAt,
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod,
    totalAmount: order.totalAmount,
    pointsUsed: order.pointsUsed,
    rewardApplied: order.rewardApplied,
    status: order.status,
  }
}
