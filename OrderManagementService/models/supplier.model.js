const mongoose = require('mongoose');

const { Schema } = mongoose;

const supplierSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('supplier', supplierSchema);
