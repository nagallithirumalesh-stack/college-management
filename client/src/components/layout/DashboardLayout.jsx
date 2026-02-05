import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role }) => {
    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar role={role} />
            <main className="flex-1 min-w-0 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
