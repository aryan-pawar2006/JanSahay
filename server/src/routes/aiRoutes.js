import express from 'express';
import { AIService } from '../services/aiService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/ai/chat (Authenticated or demo)
router.post('/chat', async (req, res) => {
  try {
    const { question, schemeId, language = 'en' } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question parameter is required' });
    }

    // Optional user ID from token
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = (await import('jsonwebtoken')).default;
        const { config } = await import('../config.js');
        const decoded = jwt.verify(token, config.jwtSecret);
        userId = decoded.id;
      } catch (e) {
        // Continue without auth context
      }
    }

    const result = await AIService.answerQuestion(question, schemeId, userId, language);

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('[AI] Chat error:', err);
    return res.status(500).json({ success: false, message: 'Error processing AI inquiry' });
  }
});

// POST /api/ai/explain/:id (Explain specific scheme in simple language)
router.post('/explain/:id', async (req, res) => {
  try {
    const schemeId = req.params.id;
    const { language = 'en' } = req.body;

    const result = await AIService.answerQuestion(
      "Explain this scheme in simple, everyday language including eligibility, benefits, and required documents.",
      schemeId,
      null,
      language
    );

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('[AI] Explain error:', err);
    return res.status(500).json({ success: false, message: 'Error generating scheme explanation' });
  }
});

export default router;
