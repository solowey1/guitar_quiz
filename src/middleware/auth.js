const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  console.log('Auth headers:', req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth token provided');
    return res.status(401).json({ success: false, message: 'Не авторизован' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.JWT_SECRET) {
    console.log('Invalid token');
    return res.status(403).json({ success: false, message: 'Нет прав доступа' });
  }

  console.log('Authentication successful');
  next();
});