// ================================
// GULPFILE CONFIGURATION
// ================================
// This Gulp configuration automates various development tasks such as preprocessing CSS, injecting assets, and live-reloading the browser during development.

// ================================
// IMPORTS
// ================================
// Importing necessary Gulp methods and plugins for automation

import { src, dest, task, watch, series } from 'gulp'; // Core Gulp methods for task automation
import * as dartsass from 'sass'; // Dart Sass compiler for SCSS processing
import gulpsass from 'gulp-sass'; // Gulp plugin to use Dart Sass for SCSS compilation
const scss = gulpsass(dartsass); // Assigning Dart Sass to the SCSS variable
import browserSync from 'browser-sync'; // BrowserSync for live-reloading and server
import sourcemaps from 'gulp-sourcemaps'; // Sourcemaps for better debugging of compiled files
import template from 'gulp-template'; // Gulp template for HTML templating
import inject from 'gulp-inject'; // Gulp plugin to inject CSS and JS files into HTML
import postcss from 'gulp-postcss'; // PostCSS plugin for applying various CSS transformations
import autoprefixer from 'autoprefixer'; // Autoprefixer for adding vendor prefixes to CSS
import less from 'gulp-less'; // Gulp plugin to compile LESS files
import stylus from 'gulp-stylus'; // Gulp plugin to compile Stylus files

// ================================
// CONFIGURATION & PATHS
// ================================
// Defining constants for file paths and reusable configuration options

// Paths object to organize file locations, making the config DRY and easy to maintain
const paths = {
  html: {
    src: './src/index.html', // Source HTML file path
    dest: './dist', // Destination folder for compiled HTML
    watch: './src/**/*.html', // Watch all HTML files in src directory
  },
  css: {
    src: {
      scss: './src/scss/**/*.scss', // Source path for SCSS files
      less: './src/less/**/*.less', // Source path for LESS files
      stylus: './src/stylus/**/*.styl', // Source path for Stylus files
    },
    dest: './dist/css', // Destination folder for compiled CSS
    watch: [
      './src/scss/**/*.{scss,sass}',
      './src/less/**/*.less',
      './src/stylus/**/*.styl',
    ], // Watch all CSS preprocessor files
  },
  dist: './dist/**/*.css', // Path for all CSS files in the dist directory
  js: './dist/**/*.js', // Path for all JS files in the dist directory
  inject: './dist/index.html', // Path to HTML file for injecting assets
};

// PostCSS Plugins - Autoprefixer ensures compatibility with various browsers by adding necessary vendor prefixes
const plugins = [
  autoprefixer({
    grid: 'autoplace', // Autoplace ensures grid layout support in older browsers
    overrideBrowserslist: ['last 100 versions'], // Targets the last 100 versions of each browser
    cascade: false, // Disables visual cascade of prefixes
    flexbox: 'no-2009', // Disables support for 2009's outdated flexbox syntax
  }),
];

// ================================
// TASKS
// ================================
// Define tasks that Gulp will execute. Each task automates a specific workflow.

// Task: HTML Processing
// This task processes the HTML file by injecting template data and moving it to the dist folder
task(
  'html',
  () =>
    src(paths.html.src) // Fetch the source HTML file
      .pipe(template({ name: 'Sindre' })) // Inject dynamic template data into the HTML file
      .pipe(dest(paths.html.dest)) // Output the processed HTML into the dist directory
      .pipe(browserSync.stream()) // Trigger BrowserSync to reload the browser with the new HTML
);

// Task: CSS Preprocessing (SCSS, Less, Stylus)
// This task handles all the CSS preprocessing (SCSS, Less, Stylus) in one go
task('styles', async () => {
  // Helper function to process different CSS preprocessors (SCSS, Less, Stylus)
  const processCSS = (processor, ext) => {
    return src(paths.css.src[ext]) // Fetch the relevant source files based on extension
      .pipe(sourcemaps.init()) // Initialize sourcemaps for better debugging of compiled files
      .pipe(processor().on('error', processor.logError)) // Compile the CSS, and handle errors gracefully
      .pipe(postcss(plugins)) // Apply PostCSS transformations (e.g., Autoprefixer)
      .pipe(sourcemaps.write('.')) // Write the sourcemaps to the same folder for easier debugging
      .pipe(dest(paths.css.dest)) // Output the processed CSS into the dist folder
      .pipe(browserSync.stream()); // Stream changes to BrowserSync, which auto-reloads the page
  };

  // Running all CSS preprocessors asynchronously
  await Promise.all([
    processCSS(scss, 'scss'), // Process SCSS files
    processCSS(less, 'less'), // Process LESS files
    processCSS(stylus, 'stylus'), // Process Stylus files
  ]);
});

// Task: Inject CSS & JS into HTML
// This task injects the compiled CSS and JS files into the HTML file for proper linkage
task('index', async () => {
  return src(paths.inject) // Fetch the HTML file that will have assets injected
    .pipe(
      inject(src(paths.dist, { read: false }), {
        ignorePath: 'dist', // Adjust paths to be relative (ignoring the 'dist' folder)
        addRootSlash: false, // Avoid adding root slashes in injected paths
        removeTags: true, // Clean up inject comments in the HTML
      })
    )
    .pipe(
      inject(src(paths.js, { read: false }), {
        ignorePath: 'dist', // Same path adjustments for JavaScript files
        addRootSlash: false, // Avoid root slashes in JS links
        removeTags: true, // Clean up inject comments in the HTML
      })
    )
    .pipe(dest('./dist')) // Output the updated HTML file into the dist folder
    .pipe(browserSync.stream()); // Trigger BrowserSync to reload with the newly injected HTML
});

// Task: BrowserSync - Local development server with live-reloading
// This task initializes BrowserSync for serving the files and watching changes for automatic browser reloads
task('browser', async () => {
  browserSync.init({
    server: {
      baseDir: './dist', // Serve files from the dist directory
    },
    open: 'local', // Automatically open the local URL in the browser
    port: 1000, // Set the port number for the local server
    ui: {
      port: 2000, // Set the port number for the BrowserSync UI
    },
    logPrefix: 'SASS Project', // Custom prefix for the BrowserSync logs
    browser: ['chrome'], // Open the project in Chrome by default
  });

  // File Watchers - Monitor files for changes and re-run relevant tasks
  watch(paths.html.watch, series('html', 'index')); // Watch HTML files and re-run the 'html' and 'index' tasks on changes
  watch(paths.css.watch, series('styles')); // Watch all CSS preprocessor files and re-run the 'styles' task on changes
  watch('./dist/index.html').on('change', browserSync.reload); // Reload the browser when HTML changes are detected
});

// Task: Default - Runs everything in sequence when you run `gulp` from the terminal
// This task will run when no specific task is defined, starting the entire development process
task('default', series('html', 'index', 'styles', 'browser')); // Run the HTML, asset injection, styles preprocessing, and BrowserSync tasks in sequence
