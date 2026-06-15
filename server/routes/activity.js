import express from 'express';
import Activity from '../models/Activity.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all activities
router.get('/', authenticateToken, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 activities
    
    const formattedActivities = activities.map(a => ({
      id: a._id.toString(),
      title: a.title,
      description: a.description,
      meta: a.meta,
      createdAt: a.createdAt.toISOString()
    }));

    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create activity
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, meta } = req.body;

    const activity = new Activity({
      title,
      description,
      meta: meta || {},
      userId: req.userId
    });

    await activity.save();

    res.status(201).json({
      id: activity._id.toString(),
      title: activity.title,
      description: activity.description,
      meta: activity.meta,
      createdAt: activity.createdAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;








