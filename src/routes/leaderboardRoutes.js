const express = require('express');
const controller = require('../controllers/leaderboardController');

const router = express.Router();

router.route('/')
  .get(controller.getLeaderboard);

module.exports = router;