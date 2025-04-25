/**
 * This file is a compatibility layer for the fast-alfred framework.
 * The actual implementation has been moved to src/main/index.js.
 */

import { main } from './src/main/index.js';

// Get the input from the command line arguments
const input = process.argv[2] || '';

// Run the main function and handle the output
main(input)
  .then((scriptFilter) => {
    // Output the script filter as JSON
    console.log(scriptFilter.toJSON());
  })
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });
