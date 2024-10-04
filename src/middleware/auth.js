const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Не авторизован' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.JWT_SECRET) {
    return res.status(403).json({ success: false, message: 'Нет прав доступа' });
  }

  next();
});