import path from 'path';
import fs from 'fs';

// Read content from index.md file
const content = fs.readFileSync(path.join(__dirname, 'index.md'), 'utf8');
console.log(content);

// This is an example of how to access the level, if necessary
const { level } = this; // This might need clarification based on your context

// Parsing error example
function test() {
  import('./a.js') // Ensure the correct file extension for ES module
    .then(() => {
      console.log('Module loaded successfully');
    })
    .catch((error) => {
      console.error('Error loading module:', error);
    });
}

// Invoke the test function to demonstrate dynamic import
test();
