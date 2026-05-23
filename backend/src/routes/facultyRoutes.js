const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Assignment = require('../models/assignment/Assignment');
const Test = require('../models/test/Test');
const Faculty = require('../models/faculty/Faculty');
const Student = require('../models/student/Student');

// PUBLIC ROUTE - Get all active faculty (for public website)
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find({ status: 'active' })
      .select('-password -salary')
      .populate('assignedCourses', 'name');
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUBLIC ROUTE - Get single faculty by ID
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .select('-password -salary')
      .populate('assignedCourses', 'name');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard
router.get('/dashboard', protect(['faculty']), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate('assignedCourses');
    const assignments = await Assignment.countDocuments({ faculty: req.user.id });
    const tests = await Test.countDocuments({ faculty: req.user.id });
    
    // Count students enrolled in faculty's assigned courses
    const courseIds = faculty.assignedCourses?.map(c => c._id) || [];
    const studentCount = await Student.countDocuments({
      enrolledCourses: { $in: courseIds },
      status: 'active'
    });
    
    res.json({
      success: true,
      stats: {
        courses: faculty.assignedCourses?.length || 0,
        students: studentCount,
        assignments,
        tests
      },
      recentActivities: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Profile
router.get('/profile', protect(['faculty']), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).select('-password');
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Courses
router.get('/courses', protect(['faculty']), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate('assignedCourses');
    res.json({ success: true, courses: faculty.assignedCourses || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ASSIGNMENTS CRUD
router.get('/assignments', protect(['faculty']), async (req, res) => {
  try {
    const assignments = await Assignment.find({ faculty: req.user.id }).populate('course').sort('-createdAt');
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/assignments', protect(['faculty']), async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, faculty: req.user.id });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/assignments/:id', protect(['faculty']), async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/assignments/:id', protect(['faculty']), async (req, res) => {
  try {
    await Assignment.findOneAndDelete({ _id: req.params.id, faculty: req.user.id });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TESTS CRUD
router.get('/tests', protect(['faculty']), async (req, res) => {
  try {
    const tests = await Test.find({ faculty: req.user.id }).populate('course').sort('-createdAt');
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/tests', protect(['faculty']), async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, faculty: req.user.id });
    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/tests/:id', protect(['faculty']), async (req, res) => {
  try {
    const test = await Test.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/tests/:id', protect(['faculty']), async (req, res) => {
  try {
    await Test.findOneAndDelete({ _id: req.params.id, faculty: req.user.id });
    res.json({ success: true, message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Students - Only students enrolled in faculty's courses
router.get('/students', protect(['faculty']), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id);
    const courseIds = faculty.assignedCourses || [];
    const students = await Student.find({
      enrolledCourses: { $in: courseIds },
      status: 'active'
    }).select('-password').populate('enrolledCourses', 'name');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Schedule
router.get('/schedule', protect(['faculty']), async (req, res) => {
  try {
    res.json({ success: true, schedule: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Course Videos
const Course = require('../models/course/Course');

router.get('/courses/:courseId/videos', protect(['faculty']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    res.json({ success: true, videos: course.videos || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/courses/:courseId/videos', protect(['faculty']), async (req, res) => {
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

router.delete('/courses/:courseId/videos/:videoId', protect(['faculty']), async (req, res) => {
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
