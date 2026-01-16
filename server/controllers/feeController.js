import Fee from '../models/Fee.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Activity from '../models/Activity.js';

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private/Admin
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title fee')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student fees
// @route   GET /api/fees/student/me
// @access  Private/Student
export const getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user._id })
      .populate('courseId', 'title fee duration')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create fee (when student enrolls)
// @route   POST /api/fees
// @access  Private/Admin
export const createFee = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const fee = await Fee.create({
      studentId,
      courseId,
      amount: course.fee,
      dueDate,
      status: 'pending',
    });

    const populatedFee = await Fee.findById(fee._id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title fee');

    res.status(201).json(populatedFee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay fee
// @route   POST /api/fees/:id/pay
// @access  Private/Student
export const payFee = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    if (fee.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({ message: 'Fee already paid' });
    }

    fee.status = 'paid';
    fee.paymentDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;

    await fee.save();

    // Log activity
    await Activity.create({
      userId: req.user._id,
      action: 'fee_payment',
      description: `Paid fee of ₹${fee.amount} for course`,
      metadata: { feeId: fee._id, courseId: fee.courseId },
    });

    const populatedFee = await Fee.findById(fee._id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title fee');

    res.json(populatedFee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fee statistics
// @route   GET /api/fees/stats
// @access  Private/Admin
export const getFeeStats = async (req, res) => {
  try {
    const totalFees = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          paidAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] },
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const stats = totalFees[0] || {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
