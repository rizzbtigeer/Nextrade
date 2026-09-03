const jwt = require('jsonwebtoken');

module.exports = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
