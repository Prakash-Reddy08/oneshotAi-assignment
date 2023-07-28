const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/connectDB');
const appointmentRoutes = require("./routes/appointmentRoute")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

connectDB()

// app.use('/api/auth', authRoutes);
// app.use('/api/calendar', calendarRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})