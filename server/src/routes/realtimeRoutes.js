import express from 'express';
import { RealtimeService } from '../services/realtimeService.js';

const router = express.Router();

// GET /api/realtime/live-ticker
router.get('/live-ticker', (req, res) => {
  const updates = RealtimeService.getLiveUpdates();
  return res.json({
    success: true,
    data: updates.slice(0, 5)
  });
});

// POST /api/realtime/sync
router.post('/sync', async (req, res) => {
  try {
    const result = await RealtimeService.refreshLiveFeeds();
    return res.json({
      success: true,
      message: 'Real-time synchronization with government databases completed successfully',
      data: result
    });
  } catch (err) {
    console.error('[Realtime] Sync error:', err);
    return res.status(500).json({ success: false, message: 'Sync error' });
  }
});

export default router;
