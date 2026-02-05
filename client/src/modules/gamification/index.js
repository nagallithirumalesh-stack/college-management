import XPWidget from './components/XPWidget';
import HeaderBadges from './components/HeaderBadges';
import LeaderboardAction from './components/LeaderboardAction';

export const GamificationModule = {
    id: 'gamification-core',
    init: ({ registerComponent }) => {

        registerComponent('student-dashboard-widgets', XPWidget, {
            id: 'widget-xp',
            order: 5 // Top priority, even before attendance? or maybe 25
        });

        // 2. Inject Badges into Header
        registerComponent('student-header-badges', HeaderBadges, {
            id: 'header-badges',
            order: 0
        });

        // 3. Inject Leaderboard Button into Quick Actions
        registerComponent('student-quick-actions', LeaderboardAction, {
            id: 'action-leaderboard',
            order: 10
        });

        console.log("🎮 Gamification Module Loaded");
    }
};
                          