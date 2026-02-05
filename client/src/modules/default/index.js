import AttendanceWidget from './components/AttendanceWidget';
import QuickActions from './components/QuickActions';
import TasksWidget from './components/TasksWidget';
import NewsWidget from './components/NewsWidget';

export const DefaultModule = {
    id: 'default-core',
    init: ({ registerComponent }) => {
        // Register Quick Actions
        registerComponent('student-quick-actions', QuickActions, { id: 'quick-actions', order: 0 });

        // Register Dashboard Widgets
        registerComponent('student-dashboard-widgets', AttendanceWidget, { id: 'widget-attendance', order: 10 });
        registerComponent('student-dashboard-widgets', TasksWidget, { id: 'widget-tasks', order: 20 });
        registerComponent('student-dashboard-widgets', NewsWidget, { id: 'widget-news', order: 30 });

        console.log("Default Module Loaded");
    }
};
