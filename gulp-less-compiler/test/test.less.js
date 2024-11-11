import gulp from 'gulp';
import assert from 'assert';
import rename from 'gulp-rename';
import del from 'del';
import gulpLessNext from '../lib/index.js'; // Update path to your gulp plugin
import fs from 'fs';
import path from 'path';

describe('gulp-less-compiler', function () {
  beforeEach(async function () {
    // Clean the output directory before each test
    await del(['dist/**', '!dist']);
  });

  it('should compile .less files to .css', function (done) {
    // Define the source LESS file and output path
    const lessFile = 'src/less/styles.less'; // Adjust path if necessary
    const outputDir = 'dist/css';
    const outputFilePath = path.join(outputDir, 'styles.css');

    gulp
      .src(lessFile, { allowEmpty: true }) // Allow empty file for testing
      .pipe(gulpLessNext()) // Use your Gulp LESS plugin
      .pipe(rename('styles.css')) // Rename the output file
      .pipe(gulp.dest(outputDir)) // Save to output directory
      .on('end', function () {
        // Check if the compiled CSS file exists
        assert.strictEqual(
          fs.existsSync(outputFilePath),
          true,
          'Compiled CSS file should exist.'
        );
        done();
      })
      .on('error', done); // Handle any errors
  });
});
