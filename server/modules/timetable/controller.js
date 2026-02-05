const { Timetable, Subject, User, Classroom } = require('../../models');
const { Op } = require('sequelize');

// Helper: Check for conflicts
const checkConflict = async ({ day, startTime, endTime, facultyId, roomId, classroomId }) => {
    // 1. Check Faculty Availability
    const facultyConflict = await Timetable.findOne({
        where: {
            day,
            facultyId,
            [Op.or]: [
                { startTime: { [Op.between]: [startTime, endTime] } },
                { endTime: { [Op.between]: [startTime, endTime] } },
                {
                    [Op.and]: [
                        { startTime: { [Op.lte]: startTime } },
                        { endTime: { [Op.gte]: endTime } }
                    ]
                }
            ]
        }
    });
    if (facultyConflict) return "Faculty is already booked at this time.";

    // 2. Check Room Availability
    const roomConflict = await Timetable.findOne({
        where: {
            day,
            room: roomId,
            [Op.or]: [
                { startTime: { [Op.between]: [startTime, endTime] } },
                { endTime: { [Op.between]: [startTime, endTime] } }
            ]
        }
    });
    if (roomConflict) return `Room ${roomId} is occupied.`;

    // 3. Check Class Availability
    const classConflict = await Timetable.findOne({
        where: {
            day,
            classroomId,
            [Op.or]: [
                { startTime: { [Op.between]: [startTime, endTime] } },
                { endTime: { [Op.between]: [startTime, endTime] } }
            ]
        }
    });
    if (classConflict) return "Class already has a session at this time.";

    return null; // No conflict
};

// Create Timetable Slot (Admin)
exports.createSlot = async (req, res) => {
    try {
        const { day, startTime, endTime, subjectId, facultyId, classroomId, roomId, type } = req.body;

        // Conflict Check
        // Note: simplified time overlap logic above might need refinement for edge cases, but good for MVP
        // Ideally convert time string "09:00" to comparable minutes from midnight

        // For MVP, assuming exact slot alignment matching for now or robust overlap later.
        // Let's rely on simple string compare if format is strict HH:MM 24h.

        // RE-IMPROVING OVERLAP LOGIC:
        // A overlaps B if (StartA < EndB) and (EndA > StartB)

        const overlapCondition = {
            day,
            [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gt]: startTime } }
            ]
        };

        const facultyBusy = await Timetable.findOne({ where: { ...overlapCondition, facultyId } });
        if (facultyBusy) return res.status(409).json({ message: "Faculty is busy." });

        const roomBusy = await Timetable.findOne({ where: { ...overlapCondition, room: roomId } });
        if (roomBusy) return res.status(409).json({ message: `Room ${roomId} is occupied.` });

        const classBusy = await Timetable.findOne({ where: { ...overlapCondition, classroomId } });
        if (classBusy) return res.status(409).json({ message: "Class is busy." });


        const slot = await Timetable.create({
            day, startTime, endTime, subjectId, facultyId, classroomId, room: roomId, type
        });

        res.status(201).json(slot);

    } catch (error) {
        console.error("Create Slot Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Full Schedule (Admin/Generic)
exports.getSchedule = async (req, res) => {
    try {
        const { classroomId, facultyId, day } = req.query;
        let where = {};
        if (classroomId) where.classroomId = classroomId;
        if (facultyId) where.facultyId = facultyId;
        if (day) where.day = day;

        const schedule = await Timetable.findAll({
            where,
            include: [
                { model: Subject, as: 'subject', attributes: ['name', 'code'] },
                { model: User, as: 'faculty', attributes: ['name'] },
                { model: Classroom, as: 'classroom', attributes: ['department', 'semester', 'section'] }
            ],
            order: [['day', 'ASC'], ['startTime', 'ASC']]
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Student Schedule (My Class)
exports.getMySchedule = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const classroom = await Classroom.findOne({
            where: {
                department: user.department,
                semester: user.semester,
                // section: user.section // If section exists in user model
            }
        });

        if (!classroom) {
            // Return empty schedule instead of error for better UX
            return res.json([]);
        }

        const schedule = await Timetable.findAll({
            where: { classroomId: classroom.id },
            include: [
                { model: Subject, as: 'subject' },
                { model: User, as: 'faculty', attributes: ['name'] }
            ],
            order: [['day', 'ASC'], ['startTime', 'ASC']]
        });

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Debug endpoint: returns authenticated user, their classroom lookup and schedule
exports.debugMy = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        const classroom = await Classroom.findOne({
            where: {
                department: user.department,
                semester: user.semester,
            }
        });

        let schedule = [];
        if (classroom) {
            schedule = await Timetable.findAll({
                where: { classroomId: classroom.id },
                include: [
                    { model: Subject, as: 'subject' },
                    { model: User, as: 'faculty', attributes: ['name'] }
                ],
                order: [['day', 'ASC'], ['startTime', 'ASC']]
            });
        }

        res.json({ user, classroom, schedule });
    } catch (error) {
        console.error('DebugMy Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get Faculty Schedule (My Teaching)
exports.getTeachingSchedule = async (req, res) => {
    try {
        const schedule = await Timetable.findAll({
            where: { facultyId: req.user.id },
            include: [
                { model: Subject, as: 'subject' },
                { model: Classroom, as: 'classroom' }
            ],
            order: [['day', 'ASC'], ['startTime', 'ASC']]
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
