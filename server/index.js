const express = require('express');

const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load .env located alongside this file to avoid issues when server is started
// from the repository root or another working directory.
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: confirm important env vars are loaded (remove in production)
console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'https://college-management-coral.vercel.app', 'https://college-management-ten.vercel.app'], // Added likely Vercel domains
    credentials: true
}));

// Database Connection
// Database Connection
// const sequelize = require('./config/database');
// const models = require('./models'); // Load models to ensure they are defined

// Sync Database
// sequelize.query("PRAGMA foreign_keys = OFF")
//     .then(() => sequelize.sync({ alter: true }))
//     .then(() => sequelize.query("PRAGMA foreign_keys = ON"))
//     .then(() => console.log('SQLite Connected & Database Synced'))
//     .catch(err => console.error('SQLite connection error:', err));
console.log('Database sync disabled (Firebase Migration - All Models)');

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
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/fees', require('./modules/fees/routes'));
app.use('/api/timetable', require('./modules/timetable/routes'));
// Modular Fees Upgrade
app.use('/uploads', express.static('uploads'));





app.get('/', (req, res) => {
    res.send('EdTrack API is running');
});

// Start Server
const { onRequest } = require("firebase-functions/v2/https");

// Start Server (Local)
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Firebase Functions
exports.api = onRequest(app);
module.exports = app;

// Force keep-alive (Debug)
setInterval(() => {
    // console.log('Heartbeat...');
}, 10000);
