const express = require('express');
const controller = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:id')
  .get(controller.getUser)
  .put(controller.updateUser)
  .delete(protect, controller.deleteUser);
  
router.route('/')
  .get(protect, controller.getUsers)
  .post(controller.createUser);

module.exports = router;