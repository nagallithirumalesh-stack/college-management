import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Placeholders for Dashboards
import AdminDashboard from './pages/AdminDashboard';
import AdminSubjects from './pages/AdminSubjects';
import AdminUsers from './pages/AdminUsers';
import FacultyDashboard from './pages/FacultyDashboard';

import FacultySubjectDetail from './pages/FacultySubjectDetail';
import StudentResources from './pages/StudentResources';
import StudentDashboard from './pages/StudentDashboard';
import SubjectDetail from './pages/SubjectDetail';
import FacultyApprovals from './pages/FacultyApprovals';
import AdminEvents from './pages/AdminEvents';
import Profile from './pages/Profile';
import Journal from './pages/Journal';
import LeaveLetter from './pages/LeaveLetter';
import FacultyQRGenerator from './pages/FacultyQRGenerator';
import StudentQRScanner from './pages/StudentQRScanner';
import ClassTeacher from './pages/ClassTeacher';
import FacultyAnnouncements from './pages/FacultyAnnouncements';
import FacultyEvents from './pages/FacultyEvents';
import StudentAnnouncements from './pages/StudentAnnouncements';

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
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/events" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEvents />
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

          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/faculty/subject/:id" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultySubjectDetail />
            </ProtectedRoute>
          } />

          <Route path="/faculty/approvals" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyApprovals />
            </ProtectedRoute>
          } />

          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/resources" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentResources />
            </ProtectedRoute>
          } />

          <Route path="/student/subject/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SubjectDetail />
            </ProtectedRoute>
          } />
          <Route path="/student/leave" element={
            <ProtectedRoute allowedRoles={['student']}>
              <LeaveLetter />
            </ProtectedRoute>
          } />
          <Route path="/student/announcements" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAnnouncements />
            </ProtectedRoute>
          } />
          <Route path="/student/scan" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentQRScanner />
            </ProtectedRoute>
          } />
          <Route path="/faculty/attendance/:id" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyQRGenerator />
            </ProtectedRoute>
          } />
          <Route path="/faculty/class" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <ClassTeacher />
            </ProtectedRoute>
          } />
          <Route path="/faculty/announcements" element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <FacultyAnnouncements />
            </ProtectedRoute>
          } />
          <Route path="/faculty/events" element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <FacultyEvents />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
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

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
