const Student = require('../models/student/Student');
const Assignment = require('../models/assignment/Assignment');
const Test = require('../models/test/Test');
const Payment = require('../models/payment/Payment');
const Job = require('../models/job/Job');

// Get Student Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate('enrolledCourses')
      .populate({ path: 'batch', populate: { path: 'course faculty', select: 'name specialization' } });
    res.json({ success: true, student });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Courses
exports.getMyCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate('enrolledCourses');
    res.json({ success: true, courses: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Assignments
exports.getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (student.dueAmount > 0) {
      return res.status(403).json({ success: false, message: 'Please complete payment to access assignments' });
    }
    const assignments = await Assignment.find({
      course: { $in: student.enrolledCourses }
    }).populate('course');
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, files } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    
    assignment.submissions.push({
      student: req.user._id,
      submittedAt: new Date(),
      files,
      status: 'submitted'
    });
    
    await assignment.save();
    res.json({ success: true, message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Tests
exports.getMyTests = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (student.dueAmount > 0) {
      return res.status(403).json({ success: false, message: 'Please complete payment to access tests' });
    }
    const tests = await Test.find({
      course: { $in: student.enrolledCourses }
    }).populate('course');
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Test
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const test = await Test.findById(testId);
    
    let score = 0;
    answers.forEach((answer, index) => {
      const question = test.questions[index];
      if (answer !== -1 && question.correctAnswer.includes(answer)) {
        score += question.marks || 0;
      }
    });
    
    const percentage = (score / test.totalMarks) * 100;
    
    test.attempts.push({
      student: req.user._id,
      answers,
      score,
      percentage,
      attemptedAt: new Date()
    });
    
    await test.save();
    res.json({ success: true, score, percentage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Payment History
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body;
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const payment = await Payment.create({
      student: req.user._id,
      amount,
      paymentMethod: method,
      transactionId,
      status: 'completed',
      paymentDate: new Date()
    });

    student.paidAmount = (student.paidAmount || 0) + parseFloat(amount);
    student.dueAmount = Math.max(0, (student.dueAmount || 0) - parseFloat(amount));
    await student.save();

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for Job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    
    const alreadyApplied = job.applications.some(
      app => app.student.toString() === req.user._id.toString()
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied for this job' });
    }
    
    job.applications.push({
      student: req.user._id,
      appliedAt: new Date(),
      resume,
      coverLetter,
      status: 'applied'
    });
    
    await job.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Job Applications
exports.getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      'applications.student': req.user._id
    });
    
    const applications = jobs.map(job => {
      const app = job.applications.find(
        a => a.student.toString() === req.user._id.toString()
      );
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location
        },
        ...app._doc
      };
    });
    
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
