import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server root directory
// This ensures .env is loaded even when running from different directories
dotenv.config({ path: join(__dirname, '../.env') });

import connectDB from './db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Faculty from '../models/Faculty.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Announcement.deleteMany({});
    await Gallery.deleteMany({});
    await Faculty.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);

    // Create sample students (using create to trigger password hashing)
    const students = await Promise.all([
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'student123',
        role: 'student',
      }),
      User.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'student123',
        role: 'student',
      }),
      User.create({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'student123',
        role: 'student',
      }),
    ]);

    console.log('Students created:', students.length);

    // Create sample faculties
    const faculties = await Faculty.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@institute.edu',
        department: 'Computer Science',
        specialization: 'Machine Learning',
        phone: '+1-234-567-8901',
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@institute.edu',
        department: 'Web Development',
        specialization: 'Full Stack Development',
        phone: '+1-234-567-8902',
      },
      {
        name: 'Dr. Emily Williams',
        email: 'emily.williams@institute.edu',
        department: 'Data Science',
        specialization: 'Algorithms & Data Structures',
        phone: '+1-234-567-8903',
      },
      {
        name: 'Prof. David Brown',
        email: 'david.brown@institute.edu',
        department: 'Database Systems',
        specialization: 'Database Design',
        phone: '+1-234-567-8904',
      },
    ]);

    console.log('Faculties created:', faculties.length);

    // Create sample courses
    const courses = await Course.insertMany([
      {
        title: 'Introduction to Computer Science',
        description: 'Learn the fundamentals of computer science and programming.',
        duration: '12 weeks',
        fee: 5000,
        facultyId: faculties[0]._id,
        capacity: 50,
        enrolledCount: 0,
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Master modern web development with React, Node.js, and MongoDB.',
        duration: '16 weeks',
        fee: 8000,
        facultyId: faculties[1]._id,
        capacity: 40,
        enrolledCount: 0,
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Deep dive into data structures and algorithmic problem solving.',
        duration: '14 weeks',
        fee: 6000,
        facultyId: faculties[2]._id,
        capacity: 45,
        enrolledCount: 0,
      },
      {
        title: 'Database Management Systems',
        description: 'Learn SQL, NoSQL, and database design principles.',
        duration: '10 weeks',
        fee: 4500,
        facultyId: faculties[3]._id,
        capacity: 35,
        enrolledCount: 0,
      },
    ]);

    console.log('Courses created:', courses.length);

    // Create sample announcements
    const announcements = await Announcement.insertMany([
      {
        title: 'Welcome to the New Academic Year',
        content: 'We are excited to welcome all students to the new academic year. Please check your course schedules and attend orientation sessions.',
        createdBy: admin._id,
      },
      {
        title: 'Course Registration Open',
        content: 'Course registration for the current semester is now open. Please register before the deadline.',
        createdBy: admin._id,
      },
      {
        title: 'Library Hours Extended',
        content: 'The library will now be open until 10 PM on weekdays to accommodate evening study sessions.',
        createdBy: admin._id,
      },
    ]);

    console.log('Announcements created:', announcements.length);

    // Create sample gallery images (using placeholder URLs)
    const galleryImages = await Gallery.insertMany([
      {
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        uploadedBy: admin._id,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
        uploadedBy: admin._id,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        uploadedBy: admin._id,
      },
    ]);

    console.log('Gallery images created:', galleryImages.length);

    console.log('✅ Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

