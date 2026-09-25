import { Router } from 'express';
import Interview from '../models/interview.js';
import { verifyToken } from '../utils/auth.middleware.js';

const router = Router();
router.use(verifyToken);

// GET /api/interviews — all interviews for this user
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ date: 1 });
    res.status(200).json(interviews);
  } catch {
    res.status(500).json({ message: 'Error fetching interviews' });
  }
});

// POST /api/interviews — schedule a new interview
router.post('/', async (req, res) => {
  try {
    const interview = new Interview({ ...req.body, userId: req.userId });
    await interview.save();
    res.status(201).json(interview);
  } catch {
    res.status(500).json({ message: 'Error creating interview' });
  }
});

// PUT /api/interviews/:id — update (reschedule, mark complete, etc.)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) { res.status(404).json({ message: 'Interview not found' }); return; }
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: 'Error updating interview' });
  }
});

// DELETE /api/interviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) { res.status(404).json({ message: 'Interview not found' }); return; }
    res.status(200).json({ message: 'Interview deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting interview' });
  }
});

export default router;
