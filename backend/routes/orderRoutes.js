const express = require('express');
const router = express.Router();
const {
  createWhatsAppOrder,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/whatsapp', createWhatsAppOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
