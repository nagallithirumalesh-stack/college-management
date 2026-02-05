const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testLogin = async () => {
    try {
        const email = 'student@example.com';
        console.log(`Testing findOne for ${email}...`);

        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            console.log('Result: User not found.');
        } else {
            console.log('Result: User found:', user.name);
        }

    } catch (error) {
        console.error('FULL ERROR MESSAGE:', error.message);
        console.error('ERROR CODE:', error.code);
        if (error.stack) console.error('STACK:', error.stack);
    }
};

testLogin();
