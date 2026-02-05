async function testTimetable() {
    try {
        console.log('Starting verification...');

        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'shaheen@edtrack.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login Failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login Successful, Token received.');

        // 2. Fetch Timetable
        const timetableRes = await fetch('http://localhost:5000/api/timetable/teaching', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!timetableRes.ok) {
            throw new Error(`Timetable Fetch Failed: ${timetableRes.status} ${timetableRes.statusText}`);
        }

        const timetableData = await timetableRes.json();
        console.log('Timetable Fetched Successfully.');
        console.log('Number of slots:', timetableData.length);

        if (timetableData.length > 0) {
            console.log('Sample Slot:', JSON.stringify(timetableData[0], null, 2));
            console.log('VERIFICATION PASSED');
        } else {
            console.log('VERIFICATION FAILED: No slots found (Empty Array)');
        }

    } catch (error) {
        console.error('VERIFICATION FAILED:', error.message);
    }
}

testTimetable();
