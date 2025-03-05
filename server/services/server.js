import express from 'express';
import { parseUserQuery } from './userQuery';
import { queryOpenAIEmbedding, queryOpenAIChat } from './openaicontroller';
import { queryPineconeDatabase } from './pinecone';

const router = express.Router();

// POST endpoint for job recommendations
router.post(
  '/job-recommendations',
  parseUserQuery,
  queryOpenAIEmbedding,
  queryPineconeDatabase,
  queryOpenAIChat,
  (req, res) => {
    return res.status(200).json({
      success: true,
      recommendations: res.locals.jobRecommendations,
    });
  }
);

export default router;
