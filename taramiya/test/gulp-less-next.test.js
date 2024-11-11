import gulp from 'gulp'; // Importing gulp
import gulpLessNext from '../lib/index.js'; // Adjust according to your file structure
import fs from 'fs'; // To check file existence
import assert from 'assert'; // To perform assertions

describe('gulp-less-compiler', () => {
  it('should compile .less files to .css', (done) => {
    const lessFilePath = 'styles/test.less'; // Correct the path to your actual .less file

    // Run your gulpLessNext task
    gulp
      .src(lessFilePath, { allowEmpty: true }) // Add allowEmpty option
      .pipe(gulpLessNext())
      .on('end', () => {
        const cssFilePath = lessFilePath.replace('.less', '.css');
        // Check if the CSS file exists
        const fileExists = fs.existsSync(cssFilePath);
        assert.strictEqual(fileExists, true, 'Compiled CSS file should exist.');
        done();
      });
  });
});
