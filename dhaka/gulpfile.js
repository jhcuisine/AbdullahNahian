import gulp from 'gulp';
import gulpLessNext from 'gulp-less-next';

// Define a task to compile LESS to CSS
const compileLess = () => {
  return gulp
    .src('src/less/*.less') // Source LESS files
    .pipe(gulpLessNext()) // Use your plugin to compile LESS
    .pipe(gulp.dest('dist/css')); // Destination folder
};

// Define the default task
export const defaultTask = gulp.series(compileLess);

// Export tasks
export { compileLess };
