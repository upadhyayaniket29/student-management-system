import Faculty from '../models/Faculty.js';
import { validationResult } from 'express-validator';

// @desc    Get all faculties
// @route   GET /api/faculties
// @access  Private
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get faculty by ID
// @route   GET /api/faculties/:id
// @access  Private
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create faculty
// @route   POST /api/faculties
// @access  Private/Admin
export const createFaculty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update faculty
// @route   PUT /api/faculties/:id
// @access  Private/Admin
export const updateFaculty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    Object.assign(faculty, req.body);
    await faculty.save();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculties/:id
// @access  Private/Admin
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
