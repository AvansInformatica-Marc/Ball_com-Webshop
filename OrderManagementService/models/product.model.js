const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier',
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model('product', productSchema);
