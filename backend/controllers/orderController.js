const Product = require('../models/Product');
const Order = require('../models/Order');
const { buildWhatsAppMessage, buildWhatsAppLink } = require('../utils/whatsapp');

// POST /api/orders/whatsapp (public)
// Reçoit le panier: { items: [{productId, qty}], city, customerNote }
// Recalcule les prix depuis la base (jamais depuis le front) pour éviter toute manipulation
exports.createWhatsAppOrder = async (req, res) => {
  const { items, city, customerNote } = req.body;
  if (!items?.length) {
    return res.status(400).json({ message: 'Le panier est vide' });
  }

  const resolvedItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Article introuvable (id: ${item.productId})` });
    }
    if (!item.qty || item.qty < 1) {
      return res.status(400).json({ message: `Quantité invalide pour ${product.name}` });
    }
    if (item.qty < product.moq) {
      return res.status(400).json({
        message: `Quantité minimum pour "${product.name}" : ${product.moq}`
      });
    }
    const unitPrice = product.getPriceForQty(item.qty);
    const subtotal = unitPrice * item.qty;
    total += subtotal;
    resolvedItems.push({
      product: product._id,
      name: product.name,
      qty: item.qty,
      unitPrice,
      subtotal
    });
  }

  const whatsappMessage = buildWhatsAppMessage({ items: resolvedItems, total, city, customerNote });
  const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER;
  const whatsappLink = buildWhatsAppLink(phoneNumber, whatsappMessage);

  const order = await Order.create({
    items: resolvedItems,
    total,
    city,
    customerNote,
    whatsappMessage
  });

  res.status(201).json({ order, whatsappMessage, whatsappLink });
};

// GET /api/orders (admin) - historique des commandes
exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json(orders);
};

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
  res.json(order);
};
