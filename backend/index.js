const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

const educationRoutes = require('./routes/education');
app.use('/api/education', educationRoutes);

const buyProductRoutes = require('./routes/buyProduct');
app.use('/api/buyproduct', buyProductRoutes);

const sellProductRoutes = require('./routes/sellProduct');
app.use('/api/sellproduct', sellProductRoutes);

const labourCostRoutes = require('./routes/labourCost');
app.use('/api/labourcost', labourCostRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // stop backend if DB connection fails
  });

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to eRecord backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

