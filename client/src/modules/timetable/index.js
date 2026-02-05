import StudentTimetableWidget from './components/StudentTimetableWidget';

export const TimetableModule = {
    id: 'timetable-module',
    init: ({ registerComponent }) => {
        // Register Student Dashboard Widget
        // Order 5 ensures it appears before Attendance (10)
        registerComponent('student-dashboard-widgets', StudentTimetableWidget, { id: 'widget-timetable', order: 5 });

        console.log("Timetable Module Loaded");
    }
};
