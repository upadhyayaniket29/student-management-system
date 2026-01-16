
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const debugLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const email = 'john@example.com';
        const password = 'student123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        console.log(`User found: ${user.email}`);
        console.log(`Stored Hashed Password: ${user.password}`);

        const isMatch = await user.matchPassword(password);
        console.log(`Password match result for '${password}': ${isMatch}`);

        if (isMatch) {
            console.log('✅ LOGIN SHOULD WORK');
        } else {
            console.log('❌ PASSWORD HOST MISMATCH');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
