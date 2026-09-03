const mongoose = require('mongoose');

const priceTierSchema = new mongoose.Schema({
  minQty: { type: Number, required: true }, // à partir de quelle quantité ce prix s'applique
  price: { type: Number, required: true }   // prix unitaire pour ce palier
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  // Ex: [{minQty:1, price:8000}, {minQty:10, price:7000}, {minQty:50, price:6000}]
  priceTiers: {
    type: [priceTierSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'Au moins un palier de prix est requis'
    }
  },
  moq: { type: Number, required: true, default: 1 }, // quantité minimum de commande
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  clicks: { type: Number, default: 0 } // pour les statistiques (historique des clics)
}, { timestamps: true });

// Calcule le prix unitaire applicable selon la quantité commandée
productSchema.methods.getPriceForQty = function (qty) {
  const sorted = [...this.priceTiers].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find(t => qty >= t.minQty);
  return tier ? tier.price : sorted[sorted.length - 1].price;
};

module.exports = mongoose.model('Product', productSchema);
