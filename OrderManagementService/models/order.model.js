const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  ],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true,
  },
  status: { type: String, required: true },
});

module.exports = mongoose.model('order', orderSchema);
