const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema({
  firstname: { type: String, required: true, max: 150 },
  lastname: { type: String, required: true, max: 150 },
  email: { type: String, required: true },
  adress: { type: String, required: true },
});

module.exports = mongoose.model('customer', customerSchema);
