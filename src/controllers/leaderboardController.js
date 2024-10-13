const Answer = require('../models/Answer');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponseWithMessage, errorResponse } = require('../utils/responseHandler');

const getLeaderboardData = async () => {
  const leaderboard = await Answer.aggregate([
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        totalTime: { $sum: "$timeSpent" },
        correctAnswersCount: {
          $sum: { $cond: ["$isFullyCorrect", 1, 0] }
        },
        correctAnswers: { $push: "$isFullyCorrect" }
      }
    },
    { $sort: { totalScore: -1, totalTime: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
        totalScore: 1,
        totalTime: 1,
        correctAnswersCount: 1,
        correctAnswers: 1
      }
    }
  ]);

  return leaderboard.map((entry, index) => ({
    ...entry,
    position: index + 1
  }));
};

exports.getLeaderboard = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.user;
    const fullLeaderboard = await getLeaderboardData();
    let response = fullLeaderboard.slice(0, 5);
    let message = '';
    let statusCode = 200;

    if (userId) {
      const userPosition = fullLeaderboard.findIndex(entry => entry.userId.toString() === userId);

      if (userPosition === -1) {
        message = 'Пользователя нет в таблице лидеров';
        statusCode = 207;
      } else {
        const userEntry = fullLeaderboard[userPosition];

        if (userPosition >= 5 && !response.some(entry => entry.userId.toString() === userId)) {
          response.push(userEntry);
        }
      }
    }

    response = response.map(entry => {
      if (userId && entry.userId.toString() === userId) {
        return entry;
      } else {
        const { userId, correctAnswers, ...rest } = entry;
        return rest;
      }
    });

    return successResponseWithMessage(res, response, message, statusCode);
  } catch (error) {
    return errorResponse(res, error.message);
  }
});