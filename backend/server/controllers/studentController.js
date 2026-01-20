import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Activity from '../models/Activity.js';
import { validationResult } from 'express-validator';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student status
// @route   PATCH /api/students/:id/status
// @access  Private/Admin
export const updateStudentStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isActive = isActive;
    await student.save();

    res.json({ message: 'Student status updated', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile/me
// @access  Private/Student
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile/me
// @access  Private/Student
export const updateStudentProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const student = await User.findById(req.user._id);
    const oldData = { name: student.name, email: student.email };

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    student.name = name || student.name;
    student.email = email || student.email;

    await student.save();

    // Log activity for profile updates
    const changes = [];
    if (oldData.name !== student.name) changes.push(`name: ${oldData.name} → ${student.name}`);
    if (oldData.email !== student.email) changes.push(`email: ${oldData.email} → ${student.email}`);

    if (changes.length > 0) {
      await Activity.create({
        userId: req.user._id,
        action: 'profile_update',
        description: `Updated profile: ${changes.join(', ')}`,
        metadata: { oldData, newData: { name: student.name, email: student.email } },
      });
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/students/profile/picture
// @access  Private/Student
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const student = await User.findById(req.user._id);

    // Update profile picture path
    student.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await student.save();

    // Log activity
    await Activity.create({
      userId: req.user._id,
      action: 'profile_picture_update',
      description: 'Updated profile picture',
      metadata: { filename: req.file.filename },
    });

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: student.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student activity (enrollments count)
// @route   GET /api/students/:id/activity
// @access  Private/Admin
export const getStudentActivity = async (req, res) => {
  try {
    const enrollmentsCount = await Enrollment.countDocuments({
      studentId: req.params.id,
    });
    res.json({ enrollmentsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

