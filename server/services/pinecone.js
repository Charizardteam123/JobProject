import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey:
    'pcsk_3uvEGq_L5Rp7JU58ARvLNxHT7aFmBDCCNRm6cJS5DLS8F9HUx5T8qkxPFokWYa2eViNPzj',
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
