const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        const userData = JSON.parse(user);
        // Only redirect if we are on the login page (index.html) or register page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'register.html') {
            redirectUser(userData.role);
        }
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            redirectUser(data.role);
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (err) {
        showError('Network error. Is the server running?');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    // Implementation for register.html inputs
}

function redirectUser(role) {
    if (role === 'admin') window.location.href = 'dashboard-admin.html';
    else if (role === 'faculty') window.location.href = 'dashboard-faculty.html';
    else window.location.href = 'dashboard-student.html';
}

function showError(msg) {
    const el = document.getElementById('errorMessage');
    el.textContent = msg;
    el.classList.remove('hidden');

    // Add shake animation to button or form
    const btn = document.querySelector('button[type="submit"]');
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
}
