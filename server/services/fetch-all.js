import processJobs from './process-jobs.js';
import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY =
  '2c03df5af19defacfeff57be3201e1707d6c14454baddf9e3f7c53542ecf3583';

/**
 * Fetches all jobs from The Muse API and saves them to results.json
 */
async function fetchAllJobsToFile() {
  const url = 'https://www.themuse.com/api/public/jobs';

  // Define the categories and levels
  const categories = [
    'Computer and IT',
    'Data and Analytics',
    'Data Science',
    'Design and UX',
    'IT',
    'Product',
    'Project Management',
    'Software Engineer',
    'Software Engineering',
    'UX',
  ];

  const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Internship'];

  // Build request parameters
  const params = new URLSearchParams();

  // Add filters
  categories.forEach((category) => params.append('category', category));
  levels.forEach((level) => params.append('level', level));
  params.append('location', 'United States');
  params.append('api_key', API_KEY);

  // Request options
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    console.log('Starting job data collection...');

    let allJobs = [];
    let currentPage = 0;
    let totalPages = 1; // Will be updated after first request

    // Process all pages - each page has 20 jobs
    while (currentPage < totalPages) {
      currentPage++;
      params.set('page', currentPage.toString());

      console.log(
        `Fetching page ${currentPage}${
          totalPages > 1 ? '/' + totalPages : ''
        }...`
      );

      // here we set the page number that is to be fetched
      const response = await fetch(`${url}?${params}`, requestOptions);

      if (!response.ok) {
        console.error(
          `Error on page ${currentPage}: ${response.status} ${response.statusText}`
        );
        // Continue to next page instead of failing completely
        continue;
      }

      const data = await response.json();

      // Update total pages on first request
      if (currentPage === 1) {
        totalPages = data.page_count;
        console.log(`Found ${totalPages} total pages of results`);
      }

      if (!data.results || data.results.length === 0) {
        console.log(`No results on page ${currentPage}, skipping`);
        continue;
      }

      // Process this batch of jobs
      const processedJobs = processJobs(data.results);

      // Add to our collection
      allJobs = allJobs.concat(processedJobs);

      console.log(
        `Retrieved ${processedJobs.length} jobs from page ${currentPage}. Total so far: ${allJobs.length}`
      );

      // Add a delay between API requests to avoid rate limiting
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`\nCompleted job data collection.`);
    console.log(`Total jobs collected: ${allJobs.length}`);

    // Write all jobs to results.json
    fs.writeFileSync('results.json', JSON.stringify(allJobs, null, 2));
    console.log(`Successfully wrote all jobs to results.json`);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the function
fetchAllJobsToFile();
