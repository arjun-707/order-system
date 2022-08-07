const mongoose = require('mongoose')
const orderSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    productId: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['placed', 'packed', 'dispatched', 'delivered', 'cancelled'],
      default: 'placed',
    },
    orderBy: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Order', orderSchema);