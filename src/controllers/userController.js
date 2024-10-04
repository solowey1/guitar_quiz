const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createUser = asyncHandler(async (req, res) => {
  try {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    const user = await User.create(req.body);
    successResponse(res, user, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    successResponse(res, {
      count: users.length,
      data: users
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    if (req.body.email) req.body.email = req.body.email.toLowerCase();

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true
    });
    
    successResponse(res, updatedUser);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    await user.remove();
    successResponse(res, null, 204);
  } catch (error) {
    errorResponse(res, error.message);
  }
});