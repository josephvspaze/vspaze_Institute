const Student = require('../models/student/Student');
const Faculty = require('../models/faculty/Faculty');
const Course = require('../models/course/Course');
const Batch = require('../models/batch/Batch');
const Payment = require('../models/payment/Payment');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalFaculty = await Faculty.countDocuments({ status: 'active' });
    const totalCourses = await Course.countDocuments({ status: 'active' });
    const totalBatches = await Batch.countDocuments({ status: 'active' });

    res.json({
      success: true,
      stats: { totalStudents, totalFaculty, totalCourses, totalBatches }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Pending Students
exports.getPendingStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: 'pending' });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve Student
exports.approveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, totalFee, enrolledCourses } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.password = password;
    student.status = 'active';
    student.totalFee = totalFee;
    student.dueAmount = totalFee;
    student.enrolledCourses = enrolledCourses;
    student.joinDate = new Date();

    await student.save();

    res.json({ success: true, message: 'Student approved successfully', student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Pending Faculty
exports.getPendingFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ status: 'pending' });
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve Faculty
exports.approveFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, salary, assignedCourses } = req.body;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    faculty.password = password;
    faculty.status = 'active';
    faculty.salary = salary;
    faculty.assignedCourses = assignedCourses;
    faculty.joinDate = new Date();

    await faculty.save();

    res.json({ success: true, message: 'Faculty approved successfully', faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('enrolledCourses batch');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().populate('assignedCourses');
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Public Faculty (only active)
exports.getPublicFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ status: 'active' }).populate('assignedCourses');
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Faculty
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Record Payment
exports.recordPayment = async (req, res) => {
  try {
    const { studentId, amount, paymentMethod, transactionId } = req.body;

    const payment = await Payment.create({
      student: studentId,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed'
    });

    const student = await Student.findById(studentId);
    student.paidAmount += amount;
    student.dueAmount = student.totalFee - student.paidAmount;
    await student.save();

    res.status(201).json({ success: true, payment, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'student',
        select: 'name email totalFee paidAmount dueAmount',
        populate: { path: 'enrolledCourses', select: 'name' }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
