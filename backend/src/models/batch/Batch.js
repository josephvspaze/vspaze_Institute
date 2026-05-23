const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Batch name is required'],
    unique: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  schedule: {
    days: [String],
    time: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  maxStudents: {
    type: Number,
    default: 50
  },
  liveClasses: [{
    title: { type: String, required: true },
    meetLink: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);
