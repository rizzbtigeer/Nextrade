const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  qty: Number,
  unitPrice: Number,
  subtotal: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  total: Number,
  city: String,
  customerNote: String,
  whatsappMessage: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
