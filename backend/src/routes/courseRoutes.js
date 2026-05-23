const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const Course = require('../models/course/Course');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.post('/', protect(['admin', 'superadmin']), createCourse);
router.put('/:id', protect(['admin', 'superadmin']), updateCourse);
router.delete('/:id', protect(['admin', 'superadmin']), deleteCourse);

// Upload brochure PDF for a course
router.post('/:id/brochure', protect(['admin', 'superadmin']), upload.single('brochure'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer);
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { brochureUrl: result.secure_url },
      { new: true }
    );
    res.json({ success: true, brochureUrl: result.secure_url, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove brochure from a course
router.delete('/:id/brochure', protect(['admin', 'superadmin']), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { brochureUrl: '' },
      { new: true }
    );
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
