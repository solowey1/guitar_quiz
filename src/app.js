require('dotenv').config();
const packageJson = require('../package.json');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const corsMiddleware = require('./middleware/corsConfig');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(corsMiddleware);

app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/', (req, res) => {
  res.json({
    message: `Welcome to ${packageJson.name} API`,
    version: packageJson.version,
    endpoints: [
      '/api/questions',
      '/api/answers',
      '/api/users',
      '/api/leaderboard'
    ]
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));