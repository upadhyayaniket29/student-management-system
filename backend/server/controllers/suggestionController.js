import Suggestion from '../models/Suggestion.js';
import Activity from '../models/Activity.js';
import { validationResult } from 'express-validator';

// @desc    Get all suggestions
// @route   GET /api/suggestions
// @access  Private/Admin
export const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student suggestions
// @route   GET /api/suggestions/student/me
// @access  Private/Student
export const getStudentSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create suggestion
// @route   POST /api/suggestions
// @access  Private/Student
export const createSuggestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const suggestion = await Suggestion.create({
      ...req.body,
      studentId: req.user._id,
    });

    // Log activity
    await Activity.create({
      userId: req.user._id,
      action: 'suggestion_submit',
      description: `Submitted suggestion: ${suggestion.title}`,
      metadata: { suggestionId: suggestion._id },
    });

    const populatedSuggestion = await Suggestion.findById(suggestion._id).populate(
      'studentId',
      'name email'
    );

    res.status(201).json(populatedSuggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update suggestion status
// @route   PATCH /api/suggestions/:id/status
// @access  Private/Admin
export const updateSuggestionStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    suggestion.status = status || suggestion.status;
    if (adminResponse) {
      suggestion.adminResponse = adminResponse;
    }

    await suggestion.save();

    const populatedSuggestion = await Suggestion.findById(suggestion._id).populate(
      'studentId',
      'name email'
    );

    res.json(populatedSuggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete suggestion
// @route   DELETE /api/suggestions/:id
// @access  Private/Student or Admin
export const deleteSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    if (
      req.user.role !== 'admin' &&
      suggestion.studentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
