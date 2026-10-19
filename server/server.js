const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Pre-mounted routes for all 6 team members
app.use('/api/auth', require('./routes/authRoutes'));     // Aditya
app.use('/api/menu', require('./routes/menuRoutes'));     // Pushkar
app.use('/api/slots', require('./routes/slotRoutes'));    // Arnav
app.use('/api/orders', require('./routes/orderRoutes'));  // Vedanti
app.use('/api/staff', require('./routes/staffRoutes'));   // Anish

app.get('/', (req, res) => {
  res.send('CampusBite API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
