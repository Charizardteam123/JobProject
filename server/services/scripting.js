// clean-descriptions.js
import fs from 'fs';
// import path from 'path';

// Function to remove HTML tags from a string
function removeHtmlTags(html) {
  // Check if input is a string
  if (typeof html !== 'string') {
    return '';
  }

  // Remove HTML tags
  // This regex handles:
  // - Standard HTML tags including attributes (<p>, <br/>, <em>, etc.)
  // - HTML entities like &nbsp;
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-z0-9]+;/g, ' ') // Replace HTML entities with space
    .replace(/\s+/g, ' ') // Normalize whitespace (convert multiple spaces to single space)
    .trim(); // Remove leading/trailing whitespace
}

// Main function to process the file
async function processJsonFile() {
  try {
    // Read the original JSON file
    console.log('Reading results.json...');
    const rawData = await fs.promises.readFile('results.json', 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(rawData);

    // Ensure the data is an array
    if (!Array.isArray(jsonData)) {
      throw new Error('Expected JSON data to be an array');
    }

    console.log(`Processing ${jsonData.length} job listings...`);

    // Process each item
    const cleanedData = jsonData.map((item) => {
      // Create a copy of the item
      const newItem = { ...item };

      // Clean the description if it exists
      if (newItem.description) {
        newItem.description = removeHtmlTags(newItem.description);
      }

      return newItem;
    });

    // Write the cleaned data to a new file
    console.log('Writing cleaned data to new_results.json...');
    await fs.promises.writeFile(
      'new_results.json',
      JSON.stringify(cleanedData, null, 2),
      'utf8'
    );

    console.log('Process completed successfully!');
    console.log(`Original file size: ${rawData.length} characters`);
    console.log(
      `New file size: ${JSON.stringify(cleanedData, null, 2).length} characters`
    );
  } catch (error) {
    console.error('Error processing the file:', error.message);
  }
}

// Execute the main function
processJsonFile();
