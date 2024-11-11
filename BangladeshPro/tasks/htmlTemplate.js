// ============================================
// Task: HTML Templating
// ============================================

import browserSync from 'browser-sync';
import { dest, src, task } from 'gulp';
import template from 'gulp-template';

task('html', () => {
  return src('src/index.html') // Source HTML file
    .pipe(template({ name: 'Sindre' })) // Apply template data (example: name)
    .pipe(dest('dist')) // Output processed HTML to the dist folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync for reload
});
