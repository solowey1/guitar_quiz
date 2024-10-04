require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.checkAuthorization = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      console.error('Invalid token:', error.message);
    }
  }
  return false;
};