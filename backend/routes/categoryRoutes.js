const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteMultipleCategories
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);


router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);
router.delete('/bulk/delete', protect, deleteMultipleCategories);

module.exports = router;
