export const formatOrderCreateResponse = (order, dishBindingObj) => {
  const resItems = order.items.map(({ dishId, quantity, price }) => ({
    dishId,
    name: dishBindingObj[dishId].name,
    quantity,
    price,
  }))

  const resOrder = order.toJSON()
  return {
    ...resOrder,
    items: resItems,
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
