// Import required dependencies
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs/promises';
// import { v4 as uuidv4 } from 'uuid';
// import { encode } from 'gpt-3-encoder'; // For token counting (optional)

// Configuration
const API_KEY =
  'pcsk_3uvEGq_L5Rp7JU58ARvLNxHT7aFmBDCCNRm6cJS5DLS8F9HUx5T8qkxPFokWYa2eViNPzj';
const INDEX_NAME = 'jobs';
// Typically you'd use environment variables for sensitive data:
// const API_KEY = process.env.PINECONE_API_KEY;
// const INDEX_NAME = process.env.PINECONE_INDEX_NAME;

/**
 * Convert job data to embeddings and metadata
 * Note: In a real application, you would need to generate embeddings using
 * an embedding model (e.g., OpenAI's text-embedding model or similar)
 * This example uses placeholder vectors for demonstration
 */
function prepareJobData(job) {
  // In a real implementation, you would:
  // 1. Send the job text to an embedding API (like OpenAI)
  // 2. Get back a vector representation
  // Here we're creating a placeholder vector of dimension 1536 (common for embeddings)

  // Generate a placeholder embedding vector (in production, use a real embedding API)
  const placeholderEmbedding = Array(1536)
    .fill(0)
    .map(() => Math.random() * 2 - 1);

  // Create metadata object (exclude the embedding from metadata)
  const metadata = {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    level: job.level,
    category: job.category,
    // Truncating description to avoid metadata size limits
    // description: job.description.substring(0, 500) + (job.description.length > 500 ? '...' : ''),
    description: job.description,
    date_posted: job.date_posted,
    url: job.url,
  };

  return {
    id: job.id.toString(), // Pinecone requires string IDs
    values: placeholderEmbedding,
    metadata,
  };
}

/**
 * Main function to load JSON data and upload to Pinecone
 */
async function uploadJobsToPinecone() {
  try {
    console.log('Starting job upload process...');

    // 1. Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: API_KEY,
    });

    // 2. Connect to index
    const index = pinecone.index(INDEX_NAME);
    console.log('Connected to Pinecone index:', INDEX_NAME);

    // 3. Read job data from file
    const rawData = await fs.readFile('./new_results.json', 'utf8');
    const jobsData = JSON.parse(rawData);
    console.log(`Loaded ${jobsData.length} jobs from file`);

    // 4. Prepare vectors for upsert (batch into chunks to avoid API limits)
    const batchSize = 100; // Adjust based on your Pinecone plan limits
    const batches = [];

    for (let i = 0; i < jobsData.length; i += batchSize) {
      const batch = jobsData.slice(i, i + batchSize);
      batches.push(batch);
    }

    console.log(`Split data into ${batches.length} batches for processing`);

    // 5. Process each batch
    let totalProcessed = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const vectors = batch.map((job) => prepareJobData(job));

      // 6. Upsert vectors to Pinecone
      await index.upsert(vectors);

      totalProcessed += batch.length;
      console.log(
        `Batch ${i + 1}/${
          batches.length
        } processed. Total jobs processed: ${totalProcessed}/${jobsData.length}`
      );
    }

    console.log('Job upload complete!');
  } catch (error) {
    console.error('Error uploading jobs to Pinecone:', error);
  }
}

// Run the upload function
uploadJobsToPinecone();
