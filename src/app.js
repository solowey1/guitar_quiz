require('dotenv').config();
const packageJson = require('../package.json');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Добавление morgan для логирования HTTP запросов
app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

// Middleware для логирования всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/user-answers', require('./routes/userAnswerRoutes'));
app.use('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в Guitar Quiz API',
    version: packageJson.version,
    endpoints: [
      '/api/questions',
      '/api/users',
      '/api/user-answers'
    ]
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));