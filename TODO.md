# EdTrack Development Plan

## Backend Changes
- [ ] Update server/package.json to use MySQL instead of SQLite
- [ ] Modify server/config/database.js for MySQL connection
- [ ] Update User model: add department, year, section, role fields
- [ ] Create Department model
- [ ] Create Year model
- [ ] Create Section model
- [ ] Create Period model
- [ ] Update AttendanceSession model for period-wise tracking
- [ ] Update AttendanceRecord model for microwave proximity
- [ ] Modify attendanceController.js: replace GPS with microwave logic, remove face verification
- [ ] Update attendanceRoutes.js: remove face verification endpoints
- [x] Update authMiddleware.js for new roles (Admin, HOD, Teacher, Student)
- [x] Create seeding scripts for sample data (departments, students, etc.)

## Frontend Changes
- [ ] Update Login/Register pages for new roles
- [ ] Create AdminDashboard: manage users, departments, timetables
- [ ] Create HODDashboard: department-level attendance filters
- [ ] Update FacultyDashboard: select department/year/section/subject/period, generate QR
- [ ] Update StudentDashboard: view department/year/section, scan QR
- [ ] Update QR scanner component for microwave proximity check
- [ ] Add Excel export components for reports

## Database & Setup
- [ ] Install and configure MySQL
- [ ] Run database migrations
- [ ] Test microwave proximity simulation
- [x] Implement Excel report generation

## Testing
- [ ] Test role-based authentication
- [ ] Test QR attendance with microwave proximity
- [ ] Test period-wise attendance tracking
- [ ] Test Excel report downloads
