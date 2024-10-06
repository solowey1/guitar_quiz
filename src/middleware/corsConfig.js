const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://orion-quiz.webflow.io',
  'https://guitar.solowey.ru'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
  credentials: true
};

module.exports = cors(corsOptions);