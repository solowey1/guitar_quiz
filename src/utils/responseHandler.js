exports.successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

exports.successResponseWithMessage = (res, data, message = '', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

exports.errorResponse = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: message
  });
};