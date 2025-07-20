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

export const formatReviewsResponse = (reviews) => {
  return reviews.map((review) => ({
    user: {
      username: review.User?.username || null,
      avatarUrl: review.User?.avatarUrl || null,
    },
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }))
}
