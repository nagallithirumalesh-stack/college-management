const fetch = require('node-fetch'); // might fail if not installed, using http is safer or just assume fetch in node 18+ (but user has node 25 so ok)

async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'student@example.com', password: 'password123' })
        });
        const data = await response.json();
        console.log('Login Status:', response.status);
        if (response.status === 200) {
            const token = data.token;
            const annResponse = await fetch('http://localhost:5000/api/announcements', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Announcements Status:', annResponse.status);
            const annData = await annResponse.json();
            console.log('Announcements:', annData.length); // Just count
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

testLogin();
