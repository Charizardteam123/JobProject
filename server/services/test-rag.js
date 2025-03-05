// test-rag.js - Script to test the job recommendation RAG system
import fs from 'fs/promises';
import { queryOpenAIEmbedding, queryOpenAIChat } from './openaicontroller.js';
import { queryPineconeDatabase } from './pinecone.js';

async function testRAGSystem() {
  try {
    console.log('Starting RAG system test...');

    // Read resume from file
    console.log('Reading resume.txt...');
    const resumeText = await fs.readFile('./resume.txt', 'utf8');
    console.log('Resume loaded successfully');

    // Mock Express request and response objects
    const mockReq = {
      body: {
        resume: resumeText,
      },
    };

    const mockRes = {
      locals: {},
    };

    // Mock next function
    const mockNext = (error) => {
      if (error) {
        console.error('Error in middleware chain:', error);
        throw new Error(error.message || 'Unknown error');
      }
    };

    // Run through the middleware chain manually
    console.log('Generating embedding for resume...');
    await queryOpenAIEmbedding(mockReq, mockRes, mockNext);
    console.log('Embedding generated successfully');

    console.log('Querying Pinecone database...');
    await queryPineconeDatabase(mockReq, mockRes, mockNext);
    console.log(
      `Found ${mockRes.locals.pineconeQueryResult?.length || 0} matching jobs`
    );

    if (
      !mockRes.locals.pineconeQueryResult ||
      mockRes.locals.pineconeQueryResult.length === 0
    ) {
      console.log('No matching jobs found. Check your Pinecone database.');
      return;
    }

    console.log('Generating job recommendations...');
    await queryOpenAIChat(mockReq, mockRes, mockNext);

    // Print the job recommendations
    console.log('\n===== JOB RECOMMENDATIONS =====\n');
    console.log(mockRes.locals.jobRecommendations);
    console.log('\n==============================\n');

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testRAGSystem();
