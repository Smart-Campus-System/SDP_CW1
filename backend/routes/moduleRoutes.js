import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Module from '../models/Module.js';
import Assignment from '../models/Assignment.js';

const router = express.Router();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find().populate('assignments');
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single module by ID
router.get('/:moduleId', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId).populate('assignments');
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add an assignment to a module (Only Admin & Lecturers)
router.post('/:moduleId/assignments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, dueDate } = req.body;
    const moduleId = req.params.moduleId;

    const assignment = new Assignment({
      moduleId,
      title,
      description,
      dueDate,
      uploadedBy: req.user._id,
    });

    await assignment.save();
    await Module.findByIdAndUpdate(moduleId, { $push: { assignments: assignment._id } });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update module completion percentage (Only Admin & Lecturers)
router.put('/:moduleId/progress', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    module.completionPercentage += 10;
    if (module.completionPercentage > 100) module.completionPercentage = 100; // Cap at 100%

    await module.save();
    res.json({ message: 'Module progress updated', completionPercentage: module.completionPercentage });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
