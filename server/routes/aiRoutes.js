import express from 'express';
import { parseUserQuery } from '../services/userQuery.js';
import { queryOpenAIEmbedding, queryOpenAIChat } from '../services/openaicontroller.js';
import { queryPineconeDatabase } from '../services/pinecone.js';

const router = express.Router();

// POST endpoint for job recommendations
router.post(
  '/job-recommendations',
  parseUserQuery,
  queryOpenAIEmbedding,
  queryPineconeDatabase,
  queryOpenAIChat,
  (req, res) => {
    return res.status(200).json({recommendation: res.locals.jobRecommendations});
  }
);

export default router;