import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'jansahay-super-secret-key-for-college-demo-2026',
  jwtExpiresIn: '7d',
  aiProvider: process.env.AI_PROVIDER || 'mock', // 'gemini' or 'mock'
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dataDir: process.env.DATA_DIR || './data',
};
