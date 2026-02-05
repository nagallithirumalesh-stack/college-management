
const http = require('http');

// Login to get token (assuming hardcoded credentials for demo)
// Actually, I'll assume I can just use a fake token or I need to login first.
// Since I just created credentials for student@example.com (or rather assigned teacher, but student exists), let's use that.
// Wait, I didn't verify student credentials, I just created faculty.
// The user "student@example.com" exists. Let's assume password "password123" or similar.
// Actually, let's bypass auth if possible? No, route is protected.

// I will try to hit the endpoint. If I don't have a token, I'll get 401.
// Let's assume I need to login first.

const loginData = JSON.stringify({
    email: "faculty@example.com", // Created earlier
    password: "password123"
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const loginReq = http.request(loginOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const token = JSON.parse(body).token;
            console.log("Got Token");
            sendODRequest(token);
        } else {
            console.log("Login Failed: " + res.statusCode);
            // Try student login if faculty fails (although I created faculty earlier)
            // Actually, OD request is likely for STUDENTS. Faculty approve them.
            // Wait, the route says: router.post('/', protect, async (req, res) => { ... studentId: req.user.id ... });
            // So ANY logged in user can request.
        }
    });
});

loginReq.write(loginData);
loginReq.end();

function sendODRequest(token) {
    const postData = JSON.stringify({
        reason: "Medical Leave",
        type: "Leave",
        dates: ["2024-02-05", "2024-02-06"],
        // purpose: "Hospital Visit" // Pass this to see if it fixes it, or omit to trigger error if backend expects it
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/od',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`OD Request Status: ${res.statusCode}`);
            console.log(`Body: ${body}`);
        });
    });

    req.write(postData);
    req.end();
}
