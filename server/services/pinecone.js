import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the root directory (where .env should be located)
const rootDir = path.resolve(__dirname, '../..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Check if API key is available in environment
let pineconeApiKey = process.env.PINECONE_API_KEY;

// Log environment variables for debugging (without exposing the actual key)
console.log('Pinecone API key is set:', pineconeApiKey ? 'Yes' : 'No');

const pc = new Pinecone({
  apiKey: pineconeApiKey,
});

// Use the correct index name as provided in your requirements
const jobsIndex = pc.index('jobs');

export const queryPineconeDatabase = async (req, res, next) => {
  console.log('Querying Pinecone database...');
  const embedding = res.locals.embedding;

  if (!embedding) {
    const error = {
      log: 'Database query middleware did not receive embedding',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  // Query Pinecone with the embedding
  try {
    const queryResponse = await jobsIndex.query({
      vector: embedding, // The embedding vector from the user's resume
      topK: 8, // Increased to get more matches (we need at least 5 + 3 as per promptBuilder)
      includeMetadata: true, // Include job metadata in the response
    });

    // Store the query results in res.locals
    console.log(`Found ${queryResponse.matches.length} matching jobs`);
    res.locals.pineconeQueryResult = queryResponse.matches;
    return next();
  } catch (err) {
    const error = {
      log: `queryPineconeDatabase: ${err}`,
      status: 500,
      message: { err: 'An error occurred while querying database' },
    };
    return next(error);
  }
};
