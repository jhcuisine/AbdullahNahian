// ============================================
// Task: Conditional LESS Compilation
// ============================================

import browserSync from 'browser-sync';
import { existsSync } from 'fs';
import { dest, src, task } from 'gulp';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import './loadEnv.js';
import { plugins } from './plugins.js';

task('less', async () => {
  // Check if the src/less directory exists and contains .less files
  if (!existsSync('./src/less')) {
    console.log('Skipping LESS task: src/less directory does not exist.');
    return Promise.resolve(); // Skip task if directory is missing
  }

  return src('./src/less/**/*.less', { allowEmpty: true }) // Source LESS files conditionally
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(
      less().on('error', (error) => {
        console.error(error.message); // Log error message to console
        this.emit('finish'); // End task gracefully
      })
    )
    .pipe(postcss(plugins)) // Apply PostCSS plugins
    .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
    .pipe(dest('./dist/css')) // Output compiled CSS to dist folder (optional directory change)
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
});
