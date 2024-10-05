const express = require('express');
const controller = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const logRouteCall = (routeName) => (req, res, next) => {
  console.log(`Route called: ${routeName}`);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
};

router.route('/')
  .get(logRouteCall('GET /users'), protect, controller.getUsers)
  .post(logRouteCall('POST /users'), controller.createUser);

router.route('/:id')
  .get(logRouteCall('GET /users/:id'), controller.getUser)
  .patch(logRouteCall('PATCH /users/:id'), controller.updateUser)
  .delete(logRouteCall('DELETE /users/:id'), protect, controller.deleteUser);

// router.route('/')
//   .get(protect, controller.getUsers)
//   .post(controller.createUser);

// router.route('/:id')
//   .get(controller.getUser)
//   .patch(controller.updateUser)
//   .delete(protect, controller.deleteUser);

module.exports = router;