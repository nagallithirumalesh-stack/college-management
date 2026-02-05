import FeesWidget from './components/FeesWidget';
import FeesAction from './components/FeesAction';


// We need a way to register routes dynamically. 
// For now, we will assume the AddonLoader or App.jsx can handle route registration if we expose it,
// OR we will use a Slot to inject the route if we had a <Slot name="routes" /> (which we don't yet).
// So for this specific demo, we will register the widget and link, and I'll manually add the route to App.jsx 
// or if the architecture allows, we can wrap the widget to redirect.

export const FeesModule = {
    id: 'fees-core',
    init: ({ registerComponent }) => {
        // 1. Dashboard Widget (High Importance)
        registerComponent('student-dashboard-widgets', FeesWidget, {
            id: 'widget-fees',
            order: 15 // Between Attendance and Tasks
        });

        // 2. Quick Action
        registerComponent('student-quick-actions', FeesAction, {
            id: 'action-fees',
            order: 25
        });

        console.log("💰 Fees Module Loaded");
    },
};
