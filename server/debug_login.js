const fetch = require('node-fetch'); // Needs node 18+ or install, assuming native fetch if node 18+

async function testLogin() {
    console.log("Attempting Login...");
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'student@test.com', // Replace with known user or demo
                password: 'password123'
            })
        });

        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log("Response:", data);

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testLogin();
