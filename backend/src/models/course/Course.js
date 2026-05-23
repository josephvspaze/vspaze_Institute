const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  subjects: [String],
  syllabus: [{
    module: String,
    topics: [String]
  }],
  videos: [{
    title: String,
    url: String,
    module: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  batches: {
    type: Number,
    default: 0
  },
  brochureUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
