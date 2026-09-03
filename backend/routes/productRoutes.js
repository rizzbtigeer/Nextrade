const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  trackClick,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/admin/all', protect, getAdminProducts);
router.get('/:slug', getProductBySlug);
router.post('/:id/click', trackClick);

router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
