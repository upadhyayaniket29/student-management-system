import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import models
import User from './models/User.js';
import Course from './models/Course.js';
import Announcement from './models/Announcement.js';
import Faculty from './models/Faculty.js';
import Suggestion from './models/Suggestion.js';
import Gallery from './models/Gallery.js';

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Announcement.deleteMany({});
        await Faculty.deleteMany({});
        await Suggestion.deleteMany({});
        await Gallery.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@praedico.com',
            password: adminPassword,
            role: 'admin',
            isActive: true,
        });
        console.log('✅ Created admin user');

        // Create Students
        const studentPassword = await bcrypt.hash('student123', 10);
        const students = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: studentPassword,
                role: 'student',
                isActive: true,
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: studentPassword,
                role: 'student',
                isActive: true,
            },
            {
                name: 'Bob Johnson',
                email: 'bob@example.com',
                password: studentPassword,
                role: 'student',
                isActive: true,
            },
        ]);
        console.log('✅ Created 3 students');

        // Create Courses
        const courses = await Course.create([
            {
                title: 'Introduction to Programming',
                description: 'Learn the fundamentals of programming using Python. Perfect for beginners with no prior coding experience. Master variables, loops, functions, and object-oriented programming.',
                duration: '12 weeks',
                fee: 15000,
                capacity: 30,
                enrolledCount: 15,
                isActive: true,
            },
            {
                title: 'Data Structures & Algorithms',
                description: 'Master essential data structures and algorithms. Learn to write efficient code and solve complex problems. Topics include arrays, linked lists, trees, graphs, sorting, and searching.',
                duration: '14 weeks',
                fee: 18000,
                capacity: 25,
                enrolledCount: 18,
                isActive: true,
            },
            {
                title: 'Web Development Fundamentals',
                description: 'Build modern websites using HTML, CSS, and JavaScript. Create responsive and interactive web applications. Learn React, Node.js, and full-stack development.',
                duration: '10 weeks',
                fee: 20000,
                capacity: 35,
                enrolledCount: 22,
                isActive: true,
            },
            {
                title: 'Database Management Systems',
                description: 'Learn database design, SQL, and NoSQL databases. Understand data modeling and optimization techniques. Work with MySQL, PostgreSQL, and MongoDB.',
                duration: '12 weeks',
                fee: 16000,
                capacity: 28,
                enrolledCount: 20,
                isActive: true,
            },
            {
                title: 'Machine Learning Basics',
                description: 'Introduction to machine learning algorithms and applications. Hands-on projects with real-world datasets. Learn Python, scikit-learn, TensorFlow, and neural networks.',
                duration: '16 weeks',
                fee: 25000,
                capacity: 20,
                enrolledCount: 12,
                isActive: true,
            },
        ]);
        console.log('✅ Created 5 courses');

        // Create Announcements
        const announcements = await Announcement.create([
            {
                title: 'Welcome to Praedico Student Management System',
                content: 'We are excited to welcome all students to our new semester! Please check your course schedules and make sure to attend the orientation session on Monday.',
                createdBy: admin._id,
            },
            {
                title: 'Mid-Term Examinations Schedule Released',
                content: 'The mid-term examination schedule has been published. Please check the academic calendar section for detailed timings and venues. Good luck with your preparations!',
                createdBy: admin._id,
            },
            {
                title: 'New Library Resources Available',
                content: 'Our digital library has been updated with new e-books and research papers. Students can access these resources 24/7 through the student portal.',
                createdBy: admin._id,
            },
            {
                title: 'Career Fair - Register Now',
                content: 'Annual career fair is scheduled for next month. Leading companies will be participating. Register through the placement cell to secure your spot.',
                createdBy: admin._id,
            },
        ]);
        console.log('✅ Created 4 announcements');

        // Create Faculties
        const faculties = await Faculty.create([
            {
                name: 'Dr. Sarah Williams',
                email: 'sarah.williams@praedico.com',
                department: 'Computer Science',
                designation: 'Associate Professor',
                qualification: 'Ph.D. in Computer Science',
                specialization: 'Programming Languages, Software Engineering',
                experience: '12 years',
                phone: '+91-9876543210',
            },
            {
                name: 'Prof. Michael Chen',
                email: 'michael.chen@praedico.com',
                department: 'Computer Science',
                designation: 'Professor',
                qualification: 'Ph.D. in Algorithms',
                specialization: 'Algorithms, Data Structures, Competitive Programming',
                experience: '18 years',
                phone: '+91-9876543211',
            },
            {
                name: 'Dr. Emily Rodriguez',
                email: 'emily.rodriguez@praedico.com',
                department: 'Information Technology',
                designation: 'Assistant Professor',
                qualification: 'Ph.D. in Web Technologies',
                specialization: 'Web Development, UI/UX Design, Frontend Technologies',
                experience: '8 years',
                phone: '+91-9876543212',
            },
            {
                name: 'Prof. David Kumar',
                email: 'david.kumar@praedico.com',
                department: 'Computer Science',
                designation: 'Professor',
                qualification: 'Ph.D. in Database Systems',
                specialization: 'Database Design, Big Data, Cloud Computing',
                experience: '15 years',
                phone: '+91-9876543213',
            },
        ]);
        console.log('✅ Created 4 faculties');

        // Create Suggestions
        const suggestions = await Suggestion.create([
            {
                studentId: students[0]._id,
                title: 'Extended Library Hours',
                content: 'It would be great if the library could stay open until 10 PM during exam weeks. Many students need quiet study spaces in the evening.',
                category: 'facilities',
                status: 'pending',
            },
            {
                studentId: students[1]._id,
                title: 'More Programming Workshops',
                content: 'Please organize more hands-on coding workshops on weekends. Topics like React, Node.js, and Python would be very helpful.',
                category: 'academic',
                status: 'reviewed',
            },
            {
                studentId: students[2]._id,
                title: 'Cafeteria Menu Variety',
                content: 'The cafeteria could offer more healthy food options and vegetarian dishes. Current menu is quite limited.',
                category: 'facilities',
                status: 'pending',
            },
            {
                studentId: students[0]._id,
                title: 'Online Course Materials',
                content: 'All course materials should be uploaded to the portal at least one day before the class. This helps in better preparation.',
                category: 'academic',
                status: 'implemented',
                adminResponse: 'Thank you for the suggestion. We have instructed all faculty members to upload materials in advance.',
            },
        ]);
        console.log('✅ Created 4 suggestions');

        // Create Gallery Images
        const galleryImages = await Gallery.create([
            {
                imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
                title: 'Campus Library',
                description: 'Our state-of-the-art library with thousands of books and digital resources',
                uploadedBy: admin._id,
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
                title: 'Computer Lab',
                description: 'Modern computer lab equipped with latest technology for hands-on learning',
                uploadedBy: admin._id,
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
                title: 'Annual Tech Fest',
                description: 'Students showcasing their innovative projects at our annual technology festival',
                uploadedBy: admin._id,
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
                title: 'Classroom Session',
                description: 'Interactive classroom sessions with experienced faculty members',
                uploadedBy: admin._id,
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
                title: 'Campus Grounds',
                description: 'Beautiful green campus providing a perfect environment for learning',
                uploadedBy: admin._id,
            },
        ]);
        console.log('✅ Created 5 gallery images');

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 1 Admin user');
        console.log('   - 3 Students');
        console.log('   - 5 Courses');
        console.log('   - 4 Announcements');
        console.log('   - 4 Faculties');
        console.log('   - 4 Suggestions');
        console.log('   - 5 Gallery images');
        console.log('\n🔐 Login Credentials:');
        console.log('   Admin: admin@praedico.com / admin123');
        console.log('   Student 1: john@example.com / student123');
        console.log('   Student 2: jane@example.com / student123');
        console.log('   Student 3: bob@example.com / student123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
