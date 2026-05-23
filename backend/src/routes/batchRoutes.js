const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Batch = require('../models/batch/Batch');
const {
  getAllBatches,
  createBatch,
  updateBatch,
  deleteBatch
} = require('../controllers/batchController');

router.use(protect(['admin', 'superadmin']));

router.get('/', getAllBatches);
router.post('/', createBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

// Live Classes CRUD
router.post('/:id/live-classes', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    batch.liveClasses.push(req.body);
    await batch.save();
    res.json({ success: true, liveClasses: batch.liveClasses });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put('/:id/live-classes/:lcId', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    const lc = batch.liveClasses.id(req.params.lcId);
    if (!lc) return res.status(404).json({ success: false, message: 'Live class not found' });
    Object.assign(lc, req.body);
    await batch.save();
    res.json({ success: true, liveClasses: batch.liveClasses });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.delete('/:id/live-classes/:lcId', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    batch.liveClasses = batch.liveClasses.filter(lc => lc._id.toString() !== req.params.lcId);
    await batch.save();
    res.json({ success: true, liveClasses: batch.liveClasses });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
