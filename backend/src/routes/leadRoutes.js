const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const BrochureLead = require('../models/lead/BrochureLead');

// PUBLIC - Submit brochure lead
router.post('/', async (req, res) => {
  try {
    const { fullName, mobile, email, qualification, city, interestedCourse } = req.body;
    const lead = await BrochureLead.create({ fullName, mobile, email, qualification, city, interestedCourse });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN - Get all leads
router.get('/', protect(['admin', 'superadmin']), async (req, res) => {
  try {
    const leads = await BrochureLead.find().sort('-createdAt');
    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN - Update lead status/notes
router.put('/:id', protect(['admin', 'superadmin']), async (req, res) => {
  try {
    const lead = await BrochureLead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN - Delete lead
router.delete('/:id', protect(['admin', 'superadmin']), async (req, res) => {
  try {
    await BrochureLead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
