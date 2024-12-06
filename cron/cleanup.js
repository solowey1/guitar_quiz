require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Answer = require('../src/models/Answer');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

cron.schedule('5 22 * * *', async () => {
  try {
    const usersToDelete = await User.find({
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' }
      ]
    });

    const userIds = usersToDelete.map(user => user._id);

    await Answer.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });

    console.log(`Ошистка завершена. Удалено ${usersToDelete.length} пользователей и их ответы`);
  } catch (error) {
    console.error('Ошибка очистки пустых пользователей:', error);
  }
});