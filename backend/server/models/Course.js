import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Please provide course duration'],
      trim: true,
    },
    fee: {
      type: Number,
      required: [true, 'Please provide course fee'],
      min: 0,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    capacity: {
      type: Number,
      default: 50,
      min: 1,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;

