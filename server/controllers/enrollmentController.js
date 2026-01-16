import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Activity from '../models/Activity.js';

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title description duration')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student enrollments
// @route   GET /api/enrollments/student/me
// @access  Private/Student
export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId', 'title description duration')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for course
// @route   POST /api/enrollments
// @access  Private/Student
export const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    // Check capacity
    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId,
    });

    // Update course enrollment count
    course.enrolledCount += 1;
    await course.save();

    // Create fee record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    await Fee.create({
      studentId: req.user._id,
      courseId,
      amount: course.fee,
      dueDate,
      status: 'pending',
    });

    // Log activity
    await Activity.create({
      userId: req.user._id,
      action: 'course_enroll',
      description: `Enrolled in course: ${course.title}`,
      metadata: { courseId, enrollmentId: enrollment._id },
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title description duration fee');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Student or Admin
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('courseId');
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if student owns this enrollment or is admin
    if (
      req.user.role !== 'admin' &&
      enrollment.studentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update course enrollment count
    if (enrollment.courseId) {
      const course = await Course.findById(enrollment.courseId._id);
      if (course && course.enrolledCount > 0) {
        course.enrolledCount -= 1;
        await course.save();
      }
    }

    // Log activity
    await Activity.create({
      userId: req.user._id,
      action: 'course_unenroll',
      description: `Unenrolled from course: ${enrollment.courseId?.title || 'Unknown'}`,
      metadata: { courseId: enrollment.courseId?._id, enrollmentId: enrollment._id },
    });

    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

