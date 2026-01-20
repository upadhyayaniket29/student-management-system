import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide suggestion content'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['academic', 'facilities', 'services', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'implemented', 'rejected'],
      default: 'pending',
    },
    adminResponse: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

export default Suggestion;
