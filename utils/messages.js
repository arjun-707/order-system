
const ErrorMsg = {
  productIdErr: { errorMessage: 'productId is required' },
  amountErr: { errorMessage: 'amount is required' },
  amountNumErr: { errorMessage: 'amount should be number' },
  orderByErr: { errorMessage: 'orderBy is required' },
  orderIdErr: { errorMessage: 'orderId is required' },
  capacityReachedErr: { errorMessage: `today's order capacity limit reached` },
  notFoundErr: { errorMessage: 'order not found' },
  dateErr: { errorMessage: 'date is required' },
  invalidDateErr: { errorMessage: 'invalid date' },
  urlNotFoundErr: { errorMessage: 'endpoint not found' },
  internal: { errorMessage: 'something went wrong' }
}
const SuccessMsg = {
  ordered: { message: 'order placed successfully' },
  list: { message: 'today orders list fetched successfully' },
  updated: { message: 'order updated successfully' },
  status: { message: 'status updated successfully' },
  deleted: { message: 'order deleted successfully' },
  fetched: { message: 'order capacity fetched successfully' },
}

module.exports = {
  SuccessMsg,
  ErrorMsg
}