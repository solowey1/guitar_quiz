require('dotenv').config();
const packageJson = require('../package.json');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

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
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/user-answers', require('./routes/userAnswerRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));