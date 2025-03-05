// import OpenAI from 'openai';
// import promptBuilder from './context.js';

// const openai = new OpenAI({
//   apiKey:
//
// });

// export const queryOpenAIEmbedding = async (req, res, next) => {
//   // We're now using the resume from req.body instead of userQuery
//   const userResume = req.body.resume || req.body.userQuery;

//   if (!userResume) {
//     const error = {
//       log: 'queryOpenAIEmbedding did not receive a user resume',
//       status: 400,
//       message: { err: 'Please provide a resume in the request body' },
//     };
//     return next(error);
//   }

//   try {
//     console.log('Generating embedding for resume...');

//     // Generate an embedding for the resume
//     const embeddingResponse = await openai.embeddings.create({
//       model: 'text-embedding-3-small',
//       input: userResume,
//       encoding_format: 'float',
//     });

//     // Store the embedding in res.locals for use in pinecone query
//     res.locals.embedding = embeddingResponse.data[0].embedding;

//     // Also store the original resume for later use in prompt
//     res.locals.userQuery = userResume;

//     console.log('Embedding generated successfully');
//     return next();
//   } catch (error) {
//     console.error('Error generating embedding:', error);
//     return next({
//       log: `Error in queryOpenAIEmbedding: ${error}`,
//       status: 500,
//       message: { err: 'Failed to generate embedding for resume' },
//     });
//   }
// };

// export const queryOpenAIChat = async (req, res, next) => {
//   const { userQuery, pineconeQueryResult } = res.locals;

//   if (!userQuery) {
//     const error = {
//       log: 'queryOpenAIChat did not receive a user resume',
//       status: 500,
//       message: { err: 'An error occurred before querying OpenAI' },
//     };
//     return next(error);
//   }

//   if (
//     !pineconeQueryResult ||
//     !Array.isArray(pineconeQueryResult) ||
//     pineconeQueryResult.length === 0
//   ) {
//     const error = {
//       log: 'queryOpenAIChat did not receive valid pinecone query results',
//       status: 500,
//       message: { err: 'No matching jobs found for this resume' },
//     };
//     return next(error);
//   }

//   try {
//     console.log('Generating job recommendations with GPT...');

//     // Build the prompt with the resume and retrieved job matches
//     const prompt = promptBuilder(userQuery, pineconeQueryResult);

//     // Call OpenAI with the proper system prompt for job recommendations
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content: `You are an AI job recommendation assistant that helps candidates find the best job matches based on their resume and available job postings.
//             Analyze the resume carefully and provide thoughtful recommendations that match the candidate's skills and experience.`,
//         },
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//     });

//     const content = response.choices[0].message.content;
//     if (!content) {
//       const error = {
//         log: 'OpenAI did not return a completion',
//         message: {
//           err: 'An error occurred while generating job recommendations',
//         },
//         status: 500,
//       };
//       return next(error);
//     }

//     // Store the complete recommendation text rather than trying to parse it
//     res.locals.jobRecommendations = content;
//     console.log('Job recommendations generated successfully');

//     return next();
//   } catch (err) {
//     console.error('Error generating job recommendations:', err);
//     const error = {
//       log: `Error in queryOpenAIChat: ${err}`,
//       message: {
//         err: 'An error occurred while generating job recommendations',
//       },
//       status: 500,
//     };
//     return next(error);
//   }
// };

import OpenAI from 'openai';
import dotenv from 'dotenv';
import process from 'process';
import { fileURLToPath } from 'url';
import path from 'path';
// import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the root directory (where .env should be located)
const rootDir = path.resolve(__dirname, '../..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Check if API key is available in environment
let apiKey = process.env.OPENAI_KEY;

// If not, try with OPENAI_API_KEY (standard naming convention)
if (!apiKey) {
  apiKey = process.env.OPENAI_API_KEY;
}

// Log environment variables for debugging (without exposing the actual key)
console.log('Environment variables loaded from:', path.join(rootDir, '.env'));
console.log('API key is set:', apiKey ? 'Yes' : 'No');

const openai = new OpenAI({
  apiKey: apiKey,
});

// Helper function to truncate job descriptions to reduce token usage
const truncateDescription = (description) => {
  if (!description) return '';
  // Limit description to approximately 300 words
  const words = description.split(' ');
  if (words.length <= 300) return description;
  return words.slice(0, 300).join(' ') + '...';
};

export const queryOpenAIEmbedding = async (req, res, next) => {
  // We're now using the resume from req.body instead of userQuery
  const userResume = req.body.resume || req.body.userQuery;

  if (!userResume) {
    const error = {
      log: 'queryOpenAIEmbedding did not receive a user resume',
      status: 400,
      message: { err: 'Please provide a resume in the request body' },
    };
    return next(error);
  }

  try {
    console.log('Generating embedding for resume...');

    // Generate an embedding for the resume
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userResume,
      encoding_format: 'float',
    });

    // Store the embedding in res.locals for use in pinecone query
    res.locals.embedding = embeddingResponse.data[0].embedding;

    // Also store the original resume for later use in prompt
    // Truncate resume if it's too long to optimize token usage
    const truncatedResume =
      userResume.length > 2000
        ? userResume.substring(0, 2000) + '...'
        : userResume;

    res.locals.userQuery = truncatedResume;

    console.log('Embedding generated successfully');
    return next();
  } catch (error) {
    console.error('Error generating embedding:', error);
    return next({
      log: `Error in queryOpenAIEmbedding: ${error}`,
      status: 500,
      message: { err: 'Failed to generate embedding for resume' },
    });
  }
};

export const queryOpenAIChat = async (req, res, next) => {
  const { userQuery, pineconeQueryResult } = res.locals;

  if (!userQuery) {
    const error = {
      log: 'queryOpenAIChat did not receive a user resume',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  if (
    !pineconeQueryResult ||
    !Array.isArray(pineconeQueryResult) ||
    pineconeQueryResult.length === 0
  ) {
    const error = {
      log: 'queryOpenAIChat did not receive valid pinecone query results',
      status: 500,
      message: { err: 'No matching jobs found for this resume' },
    };
    return next(error);
  }

  try {
    console.log('Generating job recommendations with GPT...');

    // Limit to top 5 job matches to reduce token usage
    const limitedMatches = pineconeQueryResult.slice(0, 5);

    // Create a more token-efficient job context
    const jobContext = limitedMatches
      .map((match, index) => {
        const job = match.metadata;
        return `
Job ${index + 1}:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Level: ${job.level || 'Not specified'}
Category: ${job.category || 'Not specified'}
Description: ${truncateDescription(job.description)}
URL: ${job.url || 'Not available'}
        `;
      })
      .join('\n');

    // Create a more token-efficient prompt
    const prompt = `
I need job recommendations based on this resume:

Resume: ${userQuery}

Here are some potential job matches from our database:

${jobContext}

Please provide:
1. The top 3 best matching jobs from the list above
2. 2 alternative career paths the candidate could consider
3. 3 skills the candidate should develop to improve their chances
`;

    // Use gpt-3.5-turbo instead of gpt-4 to reduce token usage
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI job recommendation assistant that helps candidates find the best job matches based on their resume and available job postings.
            Analyze the resume carefully and provide thoughtful recommendations that match the candidate's skills and experience.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000, // Limit token output
    });

    const content = response.choices[0].message.content;
    if (!content) {
      const error = {
        log: 'OpenAI did not return a completion',
        message: {
          err: 'An error occurred while generating job recommendations',
        },
        status: 500,
      };
      return next(error);
    }

    // Store the complete recommendation text
    res.locals.jobRecommendations = content;
    console.log('Job recommendations generated successfully');

    return next();
  } catch (err) {
    console.error('Error generating job recommendations:', err);
    const error = {
      log: `Error in queryOpenAIChat: ${err}`,
      message: {
        err: 'An error occurred while generating job recommendations',
      },
      status: 500,
    };
    return next(error);
  }
};
