const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: user
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  await user.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});