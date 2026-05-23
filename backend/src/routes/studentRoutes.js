const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Student = require('../models/student/Student');
const Batch = require('../models/batch/Batch');
const {
  getProfile, updateProfile, getMyCourses, getMyAssignments,
  submitAssignment, getMyTests, submitTest, getPaymentHistory,
  createPayment, getAllJobs, applyForJob, getMyApplications
} = require('../controllers/studentController');

router.use(protect(['student']));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/courses', getMyCourses);
router.get('/assignments', getMyAssignments);
router.post('/assignments/submit', submitAssignment);
router.get('/tests', getMyTests);
router.post('/tests/submit', submitTest);
router.get('/payments', getPaymentHistory);
router.post('/payments', createPayment);
router.get('/jobs', getAllJobs);
router.post('/jobs/apply', applyForJob);
router.get('/jobs/applications', getMyApplications);

// Live Classes for student
router.get('/live-classes', async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const batches = await Batch.find({ students: req.user.id }).populate('course', 'name');
    const liveClasses = batches.flatMap(batch =>
      (batch.liveClasses || []).map(lc => ({
        ...lc.toObject(),
        batchName: batch.name,
        courseName: batch.course?.name || ''
      }))
    ).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    res.json({ success: true, liveClasses });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
