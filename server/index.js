const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'], // Allow both React and HTML clients
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/gamification', require('./routes/gamificationRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/identity', require('./routes/identityRoutes'));
app.use('/api/od', require('./routes/odRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/classroom', require('./routes/classroomRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/uploads', express.static('uploads'));




app.get('/', (req, res) => {
    res.send('Smart Digital Campus API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
