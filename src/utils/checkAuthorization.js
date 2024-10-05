require('dotenv').config();

exports.checkAuthorization = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      return token === process.env.JWT_SECRET;
    } catch (error) {
      console.error('Invalid token:', error.message);
    }
  }
  return false;
};