require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/user-answers', require('./routes/userAnswerRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));