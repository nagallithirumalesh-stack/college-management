const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

const models = {};

// Manually import models to ensure order/control or use dynamic loading.
// Manual is safer for now to avoid loading 'Model.js' duplicates if I didn't delete them yet.

models.User = require('./User');
models.Subject = require('./Subject');
models.Classroom = require('./Classroom');
models.Announcement = require('./Announcement');
models.Note = require('./Note');
models.Assignment = require('./Assignment');
models.Submission = require('./Submission');
models.Event = require('./Event');
models.AttendanceSession = require('./AttendanceSession');
models.AttendanceRecord = require('./AttendanceRecord');
models.Todo = require('./Todo');
models.Journal = require('./Journal');
models.Mark = require('./Mark');
models.Notification = require('./Notification');
models.ODRequest = require('./ODRequest');
models.PerformanceMetric = require('./PerformanceMetric');

// --- Modules ---
// --- Modules ---
const feeModels = require('../modules/fees/models');
Object.assign(models, feeModels);
const timetableModels = require('../modules/timetable/models');
Object.assign(models, timetableModels);


// Helper to define associations
// Helper to define associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Module specific associations
if (feeModels.setupAssociations) {
    feeModels.setupAssociations(models);
}
if (timetableModels.setupAssociations) {
    timetableModels.setupAssociations(models);
}


module.exports = models;
