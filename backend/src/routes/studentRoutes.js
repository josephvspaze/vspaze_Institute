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

// Videos for student — based on their assigned batch's course
router.get('/videos', async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('batch enrolledCourses');

    // If student has a batch, get videos from that batch's course
    if (student.batch) {
      const batch = await Batch.findById(student.batch).populate('course');
      const course = batch.course;
      if (!course) return res.json({ success: true, videos: [], courseName: '', batchName: batch.name });
      res.json({
        success: true,
        videos: course.videos || [],
        syllabus: course.syllabus || [],
        courseName: course.name,
        batchName: batch.name,
        courseId: course._id
      });
    } else if (student.enrolledCourses?.length > 0) {
      // Fallback: no batch assigned, use first enrolled course
      const Course = require('../models/course/Course');
      const course = await Course.findById(student.enrolledCourses[0]);
      if (!course) return res.json({ success: true, videos: [], courseName: '', batchName: null });
      res.json({
        success: true,
        videos: course.videos || [],
        syllabus: course.syllabus || [],
        courseName: course.name,
        batchName: null,
        courseId: course._id
      });
    } else {
      res.json({ success: true, videos: [], syllabus: [], courseName: '', batchName: null });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

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
