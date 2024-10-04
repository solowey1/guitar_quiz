const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { checkAuthorization } = require('../utils/checkAuthorization');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const findUserByIdOrEmail = async (idOrEmail) => {
  let user = await User.findById(idOrEmail);
  if (!user && idOrEmail.includes('@')) {
    user = await User.findOne({ email: idOrEmail.toLowerCase() });
  }
  return user;
};

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
    const user = await findUserByIdOrEmail(req.params.idOrEmail);
    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.params.idOrEmail);
    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    user = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true
    });
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error.message);
  }
});
exports.updateUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.params.idOrEmail);
    if (!user) {
      const isAuthorized = checkAuthorization(req);
      if (isAuthorized) {
        user = await findUserByIdOrEmail(req.params.idOrEmail);
      } else {
        return errorResponse(res, 'У вас нет прав для изменения пользователя', 403);
      }
    }
    
    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
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
    const user = await findUserByIdOrEmail(req.params.idOrEmail);
    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }
    await user.remove();
    successResponse(res, null, 204);
  } catch (error) {
    errorResponse(res, error.message);
  }
});