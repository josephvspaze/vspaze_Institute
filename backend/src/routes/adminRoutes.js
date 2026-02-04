const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getPendingStudents,
  approveStudent,
  getPendingFaculty,
  approveFaculty,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getAllFaculty,
  getPublicFaculty,
  updateFaculty,
  deleteFaculty,
  recordPayment,
  getAllPayments
} = require('../controllers/adminController');

// Public route for fetching active faculty (for institute website)
router.get('/faculty/public', getPublicFaculty);

// Protect all admin routes
router.use(protect(['admin', 'superadmin']));

router.get('/dashboard/stats', getDashboardStats);
router.get('/students/pending', getPendingStudents);
router.put('/students/approve/:id', approveStudent);
router.get('/faculty/pending', getPendingFaculty);
router.put('/faculty/approve/:id', approveFaculty);
router.get('/students', getAllStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/faculty', getAllFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);
router.post('/payments', recordPayment);
router.get('/payments', getAllPayments);

// Course Videos Management
const Course = require('../models/course/Course');

router.get('/courses/:courseId/videos', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    res.json({ success: true, videos: course.videos || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/courses/:courseId/videos', async (req, res) => {
  try {
    const { title, url, module } = req.body;
    const course = await Course.findById(req.params.courseId);
    course.videos.push({ title, url, module, addedBy: req.user.id });
    await course.save();
    res.json({ success: true, message: 'Video added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/courses/:courseId/videos/:videoId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    course.videos = course.videos.filter(v => v._id.toString() !== req.params.videoId);
    await course.save();
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
