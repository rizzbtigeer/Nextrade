const express = require('express');
const router = express.Router();
const { 
  login, 
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/create-admin', protect, createAdmin);

router.get('/admins', protect, getAdmins);
router.put('/admins/:id', protect, updateAdmin);
router.delete('/admins/:id', protect, deleteAdmin);

module.exports = router;
