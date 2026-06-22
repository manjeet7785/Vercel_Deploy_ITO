const env = require('./env');

const corsOptions = {
  origin: (origin, callback) => {
    console.log('CORS checking origin:', origin);
    console.log('NODE_ENV:', env.NODE_ENV);
    console.log('CORS_WHITELIST:', env.CORS_WHITELIST);

    if (!origin) {
      console.log('No origin provided (e.g., same-origin request)');
      return callback(null, true);
    }

    if (env.CORS_WHITELIST.indexOf(origin) !== -1) {
      console.log('Origin found in whitelist');
      return callback(null, true);
    }

    if (env.NODE_ENV === 'development') {
      console.log('Development mode - allowing all origins');
      return callback(null, true);
    }

    console.log('Origin not allowed by CORS');
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-hash', 'x-requested-with']
};

module.exports = corsOptions;
