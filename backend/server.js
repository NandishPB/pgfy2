const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const hotelsRoutes = require('./routes/hotels');
const bookingsRoutes = require('./routes/bookings');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'PGfy API is running' }));

app.use('/auth', authRoutes);
app.use('/hotels', hotelsRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/users', usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
