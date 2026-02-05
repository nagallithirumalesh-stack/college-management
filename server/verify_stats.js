const http = require('http');

const verifyStats = async () => {
    try {
        // 1. Login
        console.log('Attempting login...');
        const loginData = JSON.stringify({ email: 'student@example.com', password: 'password123' });

        const loginReq = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                console.log('Login Response:', JSON.stringify(json, null, 2));
                if (!json.token) {
                    console.error('Login Failed:', json);
                    return;
                }
                console.log('Login Successful. User ID:', json.id);

                // 2. Fetch Stats
                const statsReq = http.request({
                    hostname: 'localhost',
                    port: 5000,
                    path: `/api/attendance/stats/${json.id}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${json.token}`
                    }
                }, (statRes) => {
                    let statData = '';
                    statRes.on('data', chunk => statData += chunk);
                    statRes.on('end', () => {
                        console.log('States API Status:', statRes.statusCode);
                        console.log('Stats Response:', statData);
                    });
                });
                statsReq.on('error', e => console.error('Stats Req Error:', e));
                statsReq.end();
            });
        });

        loginReq.on('error', e => console.error('Login Error:', e));
        loginReq.write(loginData);
        loginReq.end();

    } catch (err) {
        console.error(err);
    }
};

verifyStats();
