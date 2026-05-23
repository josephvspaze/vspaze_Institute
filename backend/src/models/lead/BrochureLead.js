const mongoose = require('mongoose');

const brochureLeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  qualification: { type: String, required: true },
  city: { type: String, required: true },
  interestedCourse: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'enrolled', 'not-interested'],
    default: 'new'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('BrochureLead', brochureLeadSchema);
