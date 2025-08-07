export const formatOrderCreateResponse = (order, dishBindingObj) => {
  const resItems = order.items.map(
    ({ dishId, sides, quantity, price, notes }) => ({
      dishId,
      name: dishBindingObj[dishId].name,
      quantity,
      price,
      notes,
      sides: sides.map(({ sideName, sidePrice }) => ({
        name: sideName,
        price: sidePrice,
      })),
    })
  )

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
