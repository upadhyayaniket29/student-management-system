import Gallery from '../models/Gallery.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Private
export const getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload gallery image via URL
// @route   POST /api/gallery
// @access  Private/Admin
export const uploadGalleryImage = async (req, res) => {
  try {
    const { imageUrl, title, description } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const galleryItem = await Gallery.create({
      imageUrl,
      title: title || '',
      description: description || '',
      uploadedBy: req.user._id,
    });

    const populatedGallery = await Gallery.findById(galleryItem._id)
      .populate('uploadedBy', 'name email');

    res.status(201).json(populatedGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload gallery image via file
// @route   POST /api/gallery/upload
// @access  Private/Admin
export const uploadGalleryFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const { title, description } = req.body;

    const galleryItem = await Gallery.create({
      imageUrl: `/uploads/gallery/${req.file.filename}`,
      title: title || '',
      description: description || '',
      uploadedBy: req.user._id,
    });

    const populatedGallery = await Gallery.findById(galleryItem._id)
      .populate('uploadedBy', 'name email');

    res.status(201).json(populatedGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryImage = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Update fields
    if (title !== undefined) galleryItem.title = title;
    if (description !== undefined) galleryItem.description = description;
    if (imageUrl !== undefined) galleryItem.imageUrl = imageUrl;

    await galleryItem.save();

    const populatedGallery = await Gallery.findById(galleryItem._id)
      .populate('uploadedBy', 'name email');

    res.json(populatedGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryImage = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
