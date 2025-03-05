// const promptBuilder = (userQuery, pineconeQueryResult) => {
//   // Update to reflect the correct metadata format from your job listings
//   const context = pineconeQueryResult
//     .map((match) => {
//       const job = match.metadata;
//       return `
// Job Title: ${job.title}
// Company: ${job.company}
// Location: ${job.location}
// Level: ${job.level}
// Category: ${job.category}
// Description: ${job.description}
// Date Posted: ${job.date_posted}
// URL: ${job.url}
//       `;
//     })
//     .filter(Boolean)
//     .join('\n\n');

//   const prompt = `
//   You are an expert in finding tech jobs for developers.
//   You first find the 5 jobs for a candidate based on his/her resume qualifications and job postings you know of for remote or within 30 miles of the candidate's city/town (or in the state of the candidate, if no city/town is specified).
//   Besides these 5 jobs, you should also give the candidate some other jobs (3 at most) other ones for the candidate to consider based on his/her background. These are perhaps not as technical or don't seem to reflect the type of job the candidate seems most focused on getting, based on his/her resume. These are more like 'edge' cases.

//   For instance, I'll give you examples: the candidate seems intently on getting a job as a software developer. However, given the candidate's background in other areas and other technical or non-technical skills, you identify possibilities the candidate might want to consider. An example might be a candidate who has a background in law to work as a project manager for a software/tech firm that serves the law industry, or as a writer of documentation for law software, or as sales of a software firm whose business is in law. Or perhaps a candidate who has language skills to work not particularly as a developer, but perhaps in sales, or as a product manager, or research assistant. You recognize that technical skills may be very valuable even in non-programming jobs.

//   Finally you should give suggestions for the candidate to consider emphasizing more on specific skills or on learning new skills that would place him/her in a much more competitive position, taking into account his/her background and the market opportunities that you see out there and his/her job location preference.

//   Consider that the candidate may not have many years of experience as a developer, but jobs listed with up to 4-5 years of experience may be acceptable to him/her.

//   Your response should be in the following format:

//   [Best Qualifying Jobs:]
//   [Job #]: [Job Title]
//   [Company]
//   [Location]
//   [Level]
//   [Category]
//   [Description]
//   [Data Posted]
//   [URL] ...
//   [Given Your Background, please consider the following jobs as well...]
//   [Job #]: [Job Title]
//   [Company]
//   [Location]
//   [Level]
//   [Category]
//   [Description]
//   [Data Posted]
//   [URL] ...
//   [Suggestions for improving your chances of finding a job, given your current resume:]

//   The job postings I've found that might match your resume are:
//   ${context}

//   The candidate's resume: ${userQuery}
//   `;

//   return prompt;
// };

// export default promptBuilder;

// Helper function to truncate job descriptions to reduce token usage
const truncateDescription = (description) => {
  if (!description) return '';
  // Limit description to approximately 100 words
  const words = description.split(' ');
  if (words.length <= 100) return description;
  return words.slice(0, 100).join(' ') + '...';
};

const promptBuilder = (userQuery, pineconeQueryResult) => {
  // Limit to top 5 matches to reduce token usage
  const limitedMatches = pineconeQueryResult.slice(0, 5);

  // Update to reflect the correct metadata format with truncated descriptions
  const context = limitedMatches
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
    .filter(Boolean)
    .join('\n\n');

  // Simplified prompt that requires fewer tokens
  const prompt = `
You are an expert in finding tech jobs for developers.

Based on the candidate's resume, recommend:
1. The top 3 most suitable jobs from the context
2. 2 alternative career paths the candidate might consider
3. 3 skills the candidate should develop to improve their job prospects

The job postings available are:
${context}

The candidate's resume (truncated): ${userQuery}
  `;

  return prompt;
};

export default promptBuilder;
