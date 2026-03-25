require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://skyflightbooking.netlify.app'
];

// ✅ CORS Setup (FINAL)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps / postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ⭐ VERY IMPORTANT (fix preflight requests)
app.options('*', cors());

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =======================
// 🚀 ROUTES
// =======================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));

// =======================
// 🧪 HEALTH + ROOT
// =======================

app.get('/api/health', (_, res) => {
  res.json({ status: 'OK', app: 'SkyBook API ✈', version: '2.0' });
});

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// =======================
// ❌ GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error(err.stack);

  // CORS specific error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS blocked this request' });
  }

  res.status(500).json({ message: 'Internal server error' });
});

// =======================
// 🔥 SERVER START
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 SkyBook API running → http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health\n`);
});