const XLSX = require('xlsx');

// Function to export attendance data to Excel
const exportAttendanceReport = (data, filename = 'attendance_report.xlsx') => {
    try {
        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Prepare data for Excel
        const excelData = data.map(record => ({
            'Student Name': record.student?.name || 'N/A',
            'Roll Number': record.student?.rollNumber || record.student?.email || 'N/A',
            'Department': record.student?.department || 'N/A',
            'Year': record.student?.year || 'N/A',
            'Section': record.student?.section || 'N/A',
            'Subject': record.subject?.name || 'N/A',
            'Date': record.session?.createdAt ? new Date(record.session.createdAt).toLocaleDateString() : 'N/A',
            'Period': record.session?.periodId || 'N/A',
            'Status': record.status,
            'Verification Method': record.verificationMethod,
            'Timestamp': record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Auto-size columns
        const columnWidths = [
            { wch: 15 }, // Student Name
            { wch: 15 }, // Roll Number
            { wch: 12 }, // Department
            { wch: 8 },  // Year
            { wch: 8 },  // Section
            { wch: 20 }, // Subject
            { wch: 12 }, // Date
            { wch: 8 },  // Period
            { wch: 10 }, // Status
            { wch: 15 }, // Verification Method
            { wch: 18 }  // Timestamp
        ];
        worksheet['!cols'] = columnWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return buffer;
    } catch (error) {
        console.error('Error generating Excel report:', error);
        throw new Error('Failed to generate Excel report');
    }
};

// Function to export student-wise attendance summary
const exportStudentSummaryReport = (data, filename = 'student_summary.xlsx') => {
    try {
        const workbook = XLSX.utils.book_new();

        const excelData = data.map(student => ({
            'Student Name': student.name,
            'Roll Number': student.rollNumber || student.email,
            'Department': student.department,
            'Year': student.year,
            'Section': student.section,
            'Total Classes': student.total,
            'Classes Attended': student.attended,
            'Attendance Percentage': student.percentage + '%'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        const columnWidths = [
            { wch: 15 }, // Student Name
            { wch: 15 }, // Roll Number
            { wch: 12 }, // Department
            { wch: 8 },  // Year
            { wch: 8 },  // Section
            { wch: 12 }, // Total Classes
            { wch: 15 }, // Classes Attended
            { wch: 18 }  // Attendance Percentage
        ];
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Summary');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return buffer;
    } catch (error) {
        console.error('Error generating student summary Excel report:', error);
        throw new Error('Failed to generate student summary Excel report');
    }
};

module.exports = {
    exportAttendanceReport,
    exportStudentSummaryReport
};
