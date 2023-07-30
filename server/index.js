const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/connectDB');
const appointmentRoutes = require("./routes/appointmentRoute")
const authRoutes = require("./routes/authRoute")
const refreshRoutes = require('./routes/refreshRoute')
const cookieParser = require("cookie-parser")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
connectDB()

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/refresh', refreshRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})