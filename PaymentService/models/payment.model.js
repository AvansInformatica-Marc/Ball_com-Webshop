const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentSchema = new Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true,},
  amount: { type: Number, required: true },
  completed: { type: Boolean, required: true },
});

// Export the model
module.exports = mongoose.model('payment', paymentSchema);
