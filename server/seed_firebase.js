const { db } = require('./config/firebase');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const seedFirebase = async () => {
    try {
        console.log("Checking database connection...");
        const usersRef = collection(db, 'users');

        // Define users
        const users = [
            {
                name: 'Dr. Sarah Wilson',
                email: 'faculty@smartcampus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Computer Science'
            },
            {
                name: 'John Doe',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                semester: 3,
                points: 120,
                band: 'Silver'
            }
        ];

        for (const u of users) {
            // Check if exists
            const q = query(usersRef, where('email', '==', u.email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                console.log(`User ${u.email} already exists.`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(u.password, 10);

            const newUser = {
                ...u,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = await addDoc(usersRef, newUser);
            console.log(`Created user: ${u.email} (ID: ${docRef.id})`);
        }

        console.log("Seeding completed.");

    } catch (error) {
        console.error("Seeding Failed:", error.message);
        console.log("HINT: Ensure your Firestore Security Rules are set to 'allow read, write: if true;' for development, or authenticate this client.");
    }
};

seedFirebase();
