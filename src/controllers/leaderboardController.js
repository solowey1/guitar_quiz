const Answer = require('../models/answer');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getLeaderboardData = async (limit = 5) => {
  const leaderboard = await Answer.aggregate([
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        totalTime: { $sum: '$timeSpent' }
      }
    },
    { $sort: { totalScore: -1, totalTime: 1 } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    { $unwind: '$userDetails' },
    {
      $project: {
        totalScore: 1,
        totalTime: 1,
        firstname: '$userDetails.firstname',
        lastname: '$userDetails.lastname'
      }
    }
  ]);

  return leaderboard.map((entry, index) => ({
    position: index + 1,
    name: `${entry.firstname} ${entry.lastname}`,
    score: entry.totalScore,
    time: entry.totalTime
  }));
};

exports.getLeaderboard = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.user;
    const fullLeaderboard = await getLeaderboardData();
    let response = fullLeaderboard.slice(0, 5);

    if (userId) {
      const userPosition = fullLeaderboard.findIndex(entry =>
        entry.name === `${entry.firstname} ${entry.lastname}`
      );

      if (userPosition === -1) {
        return errorResponse(res, 'Пользователя нет в таблице лидеров', 404);
      }

      const userEntry = fullLeaderboard[userPosition];
      userEntry.position = userPosition + 1;

      if (userPosition >= 5 && !response.some(entry => entry.name === userEntry.name)) {
        response.push(userEntry);
      }
    }

    return successResponse(res, response);
  } catch (error) {
    return errorResponse(res, error.message);
  }
});



// const mongoose = require('mongoose');
// const Answer = require('../models/Answer');
// const User = require('../models/User');
// const asyncHandler = require('../utils/asyncHandler');
// const { successResponse, errorResponse } = require('../utils/responseHandler');

// const getLeaderboardData = async (limit = 5) => {
//   const leaderboard = await Answer.aggregate([
//     {
//       $group: {
//         _id: '$userId',
//         totalScore: { $sum: '$score' },
//         totalTime: { $sum: '$timeSpent' }
//       }
//     },
//     { $sort: { totalScore: -1, totalTime: 1 } },
//     { $limit: limit },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'userDetails'
//       }
//     },
//     { $unwind: '$userDetails' },
//     {
//       $project: {
//         _id: 1,
//         totalScore: 1,
//         totalTime: 1,
//         firstname: '$userDetails.firstname',
//         lastname: '$userDetails.lastname'
//       }
//     }
//   ]);

//   return leaderboard.map((entry, index) => ({
//     position: index + 1,
//     name: `${entry.firstname} ${entry.lastname}`,
//     score: entry.totalScore,
//     time: entry.totalTime,
//     userId: entry._id
//   }));
// };

// exports.getLeaderboard = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const leaderboard = await getLeaderboardData();

//     if (!userId) {
//       return successResponse(res, leaderboard.slice(0, 5));
//     }

//     const userPosition = await Answer.aggregate([
//       {
//         $group: {
//           _id: '$userId',
//           totalScore: { $sum: '$score' },
//           totalTime: { $sum: '$timeSpent' }
//         }
//       },
//       { $sort: { totalScore: -1, totalTime: 1 } },
//       {
//         $group: {
//           _id: null,
//           positions: { $push: '$_id' }
//         }
//       },
//       {
//         $project: {
//           position: { $indexOfArray: ['$positions', mongoose.Types.ObjectId(userId)] }
//         }
//       }
//     ]);

//     const userRank = userPosition[0] ? userPosition[0].position + 1 : null;

//     if (userRank === null) {
//       return errorResponse(res, 'User not found in leaderboard', 404);
//     }

//     const userDetails = leaderboard.find(entry => entry.userId.toString() === userId);

//     if (!userDetails) {
//       return errorResponse(res, 'User details not found', 404);
//     }

//     const response = {
//       topFive: leaderboard.slice(0, 5),
//       userInfo: {
//         ...userDetails,
//         position: userRank
//       }
//     };

//     return successResponse(res, response);
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// });