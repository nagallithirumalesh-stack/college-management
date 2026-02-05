import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './firebase'; // Initialize Firebase
import { AuthProvider, useAuth } from './context/AuthContext';
import { SlotProvider, AddonLoader } from './core/SlotRegistry';
import { DefaultModule } from './modules/default';
import { GamificationModule } from './modules/gamification';
import { FeesModule } from './modules/fees';
import { TimetableModule } from './modules/timetable';

import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentQRScanner from './pages/StudentQRScanner';
import StudentSubjects from './pages/StudentSubjects';
import StudentTimetable from './pages/StudentTimetable';
import StudentAssignments from './pages/StudentAssignments';
import FeesPage from './modules/fees/pages/FeesPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminSubjects from './pages/AdminSubjects';
import AdminUsers from './pages/AdminUsers';
import AdminEvents from './pages/AdminEvents';
import AdminFees from './pages/AdminFees';
import AdminTimetable from './pages/AdminTimetable';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminSystem from './pages/AdminSystem';


// Faculty Pages
import FacultyDashboard from './pages/FacultyDashboard';
import FacultySubjectDetail from './pages/FacultySubjectDetail';
import FacultyTimetable from './pages/FacultyTimetable';
import FacultyApprovals from './pages/FacultyApprovals';
import FacultyQRGenerator from './pages/FacultyQRGenerator';
import ClassTeacher from './pages/ClassTeacher';
import FacultyAnnouncements from './pages/FacultyAnnouncements';
import FacultyEvents from './pages/FacultyEvents';
import FacultyAIInsights from './pages/FacultyAIInsights';
import FacultyAttendance from './pages/FacultyAttendance';
import FacultyManualAttendance from './pages/FacultyManualAttendance';

// Shared / Other Pages
import Profile from './pages/Profile';
import Journal from './pages/Journal';
import LeaveLetter from './pages/LeaveLetter';
import StudentLeaderboard from './pages/StudentLeaderboard';
import StudentResources from './pages/StudentResources';
import SubjectDetail from './pages/SubjectDetail';
import StudentAnnouncements from './pages/StudentAnnouncements';
import ChatPage from './pages/ChatPage';
import AIInsights from './pages/AIInsights';
import ThreeBackground from './components/ThreeBackground';
import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />; // Or 404/Unauthorized page

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'faculty') return <Navigate to="/faculty" />;
  return <Navigate to="/student" />;
}

function App() {
  return (
    <AuthProvider>
      <SlotProvider>
        <AddonLoader addons={[DefaultModule, GamificationModule, FeesModule, TimetableModule]} />
        <ThreeBackground />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/scan" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentQRScanner />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/subjects" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentSubjects />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/fees" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <FeesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/timetable" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentTimetable />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentAssignments />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/resources" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentResources />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/subject/:id" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <SubjectDetail />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <StudentAnnouncements />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/chat" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <ChatPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/ai-insights" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout role="student">
                  <AIInsights />
                </DashboardLayout>
              </ProtectedRoute>
            } />


            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/subjects" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSubjects />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/fees" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFees />
              </ProtectedRoute>
            } />
            <Route path="/admin/timetable" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTimetable />
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/admin/system" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSystem />
              </ProtectedRoute>
            } />


            {/* Faculty Routes */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/subject/:subjectId" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultySubjectDetail />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/approvals" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyApprovals />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/qr-generator" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyQRGenerator />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/manual" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyManualAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/class" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <ClassTeacher />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/announcements" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyAnnouncements />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/events" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyEvents />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/timetable" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyTimetable />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/faculty/ai-insights" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyAIInsights />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/faculty/attendance/:subjectId" element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty">
                  <FacultyManualAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Common Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['admin', 'faculty', 'student']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/student/journal" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/student/leave" element={
              <ProtectedRoute allowedRoles={['student']}>
                <LeaveLetter />
              </ProtectedRoute>
            } />
            <Route path="/student/leaderboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLeaderboard />
              </ProtectedRoute>
            } />

          </Routes>
        </Router>
      </SlotProvider>
    </AuthProvider>
  );
}

export default App;
