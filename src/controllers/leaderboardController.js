const Answer = require('../models/Answer');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getLeaderboardData = async () => {
  const leaderboard = await Answer.aggregate([
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        totalTime: { $sum: "$timeSpent" }
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
        totalTime: 1
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

    if (userId) {
      const userPosition = fullLeaderboard.findIndex(entry => entry.userId.toString() === userId);

      if (userPosition === -1) {
        return errorResponse(res, 'Пользователя нет в таблице лидеров', 404);
      }

      const userEntry = fullLeaderboard[userPosition];

      if (userPosition >= 5 && !response.some(entry => entry.userId.toString() === userId)) {
        response.push(userEntry);
      }
    }

    response = response.map(({ userId, ...rest }) => rest);

    return successResponse(res, response);
  } catch (error) {
    return errorResponse(res, error.message);
  }
});