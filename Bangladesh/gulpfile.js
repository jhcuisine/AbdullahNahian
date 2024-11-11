// ============================================
// Gulpfile Configuration for Task Automation
// ============================================

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config(); // Load .env file contents into process.env

// Importing Gulp and Required Plugins
import { src, dest, task, watch, series } from 'gulp';
import * as dartsass from 'sass';
import gulpsass from 'gulp-sass';
const scss = gulpsass(dartsass);
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import template from 'gulp-template';
import inject from 'gulp-inject';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import less from 'gulp-less';
import stylus from 'gulp-stylus';

// Postcss Plugins
import postcssSimpleVars from 'postcss-simple-vars'; // Allows using variables in CSS
import postcssNestedVars from 'postcss-nested-vars'; // Supports nested variables in CSS
import cssvariables from 'postcss-css-variables'; // Polyfills CSS custom properties (variables)
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import rename from 'gulp-rename'; // Import gulp-rename

import * as del from 'del'; // Import 'del' using named imports

// ============================================
// PostCSS Plugins Configuration
// ============================================

// Plugins to be applied to CSS, including Autoprefixer for browser compatibility
const plugins = [
  autoprefixer({
    env: process.env.NODE_ENV || 'production', // Set the environment for Browserslist
    cascade: process.env.AUTOPREFIXER_CASCADE === 'true', // Use Visual Cascade
    add: process.env.AUTOPREFIXER_ADD === 'true', // Add vendor prefixes
    remove: process.env.AUTOPREFIXER_REMOVE === 'true', // Remove outdated prefixes
    supports: process.env.AUTOPREFIXER_SUPPORTS === 'true', // Add prefixes for @supports
    flexbox: process.env.AUTOPREFIXER_FLEXBOX === 'true', // Flexbox prefixing
    grid: process.env.AUTOPREFIXER_GRID || false, // Grid support
    overrideBrowserslist: [
      'last 100 versions', // Target the last 100 browser versions
      'ie >= 11', // Support IE 11 and above
      'not dead', // Exclude outdated browsers
      'last 2 iOS versions', // Last two versions of iOS
      'last 2 Android versions', // Last two versions of Android
    ],
  }),
  cssvariables(), // Add support for CSS variables
  // postcssNestedVars(), // Add support for nested variables
  postcssSimpleVars(), // Add support for simple variables
  postcssNesting(),
  // postcssPartialImport({ prefix: '_', extension: '.css' }),
  postcssImport(),
];

// ============================================
// Task: PostCSS Processing
// ============================================

// // This task processes CSS files using PostCSS plugins (e.g., Autoprefixer)
// task('postcss', async () => {
//   return (
//     src('./src/postcss/**/*.pcss') // Source CSS files from the src/postcss directory
//       .pipe(sourcemaps.init()) // Initialize sourcemaps for better debugging
//       .pipe(postcss(plugins).on('error', console.error.bind(console))) // Apply PostCSS plugins (Autoprefixer)
//       .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
//       // .pipe(
//       //   rename({
//       //     // Rename the output file
//       //     // basename: 'styles', // Base name of the output file
//       //     // suffix: '.min', // Append .min to the file name
//       //     extname: '.css', // Change the extension to .css
//       //   })
//       // )
//       .pipe(
//         rename((path) => {
//           // Rename the output file based on the original filename
//           if (path.basename.startsWith('_')) {
//             path.basename = path.basename.slice(1); // Remove leading underscore for output
//           }
//           path.extname = '.css'; // Ensure the output has .css extension
//         })
//       ) // Rename the output files
//       .pipe(dest('./dist/postcss')) // Output processed CSS to the dist/css folder
//       .pipe(browserSync.stream())
//   ); // Stream changes to BrowserSync for live reload
// });

// Gulp task to clean up unnecessary files

task('clean', () => {
  return del(['./dist/postcss/_*.css']); // Delete any file starting with an underscore in the output folder
});

task('postcss', async () => {
  src('./src/postcss/**/*.css') // Source CSS files from the src/postcss directory
    .pipe(sourcemaps.init()) // Initialize sourcemaps for better debugging
    .pipe(postcss(plugins).on('error', console.error.bind(console))) // Apply PostCSS plugins
    .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
    // .pipe(
    //   rename((path) => {
    //     // Rename output file if it starts with an underscore
    //     if (path.basename.startsWith('_')) {
    //       path.basename = path.basename.slice(1); // Remove leading underscore
    //     }
    //   })
    // )
    .pipe(dest('./dist/postcss')) // Output processed CSS to the dist/postcss folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync for live reload
});

// ============================================
// Task: Inject CSS & JS into HTML
// ============================================

task('index', async () => {
  src('./dist/index.html') // Target HTML file in the dist folder
    .pipe(
      inject(
        src('./dist/**/*.css', { read: false }), // Inject all CSS files into the HTML
        { ignorePath: 'dist', addRootSlash: false, removeTags: true }
      )
    )
    .pipe(
      inject(
        src('./dist/**/*.js', { read: false }), // Inject all JS files into the HTML
        { ignorePath: 'dist', addRootSlash: false, removeTags: true }
      )
    )
    .pipe(dest('./dist')) // Save the updated HTML file in dist folder
    .pipe(browserSync.stream()); // Trigger BrowserSync to reload the page
});

// ============================================
// Task: HTML Templating
// ============================================

task(
  'html',
  () =>
    src('src/index.html') // Source HTML file
      .pipe(template({ name: 'Sindre' })) // Apply template data (example: name)
      .pipe(dest('dist')) // Output processed HTML to the dist folder
      .pipe(browserSync.stream()) // Stream changes to BrowserSync for reload
);

// ============================================
// Task: SCSS Compilation
// ============================================

task('scss', async () => {
  src('./src/scss/**/*.scss') // Source SCSS files
    .pipe(sourcemaps.init()) // Initialize sourcemaps for better debugging
    .pipe(
      scss({
        outputStyle: 'expanded', // Specify the output style: nested, expanded, compact, compressed
        sourceMap: true, // Generate sourcemaps (true/false)
        sourceMapContents: true, // Include original file contents in the source map (true/false)
        sourceMapEmbed: true, // Embed the source map directly in the CSS file (true/false)
        precision: 5, // Control the precision of the output values (number of decimal places)
        indentType: 'space', // Specify indentation type: 'space' or 'tab'
        indentWidth: 2, // Number of spaces for indentation if indentType is 'space'
        linefeed: 'auto', // Type of line feed: 'lf' (Unix), 'cr' (Mac), 'crlf' (Windows)
        errorLogToConsole: true, // Log errors to the console (true/false)
        quiet: false, // Suppress output except for errors (true/false)
        includePaths: ['./src/scss'], // Additional paths to look for imports
        style: 'expanded', // Specifies the style of the output (deprecated in Dart Sass; use outputStyle instead)
        importOnce: true, // Import each file only once (true/false)
        functions: {
          // Define custom Sass functions if needed
          'my-function($arg)': function (arg) {
            return new sass.types.Number(42); // Example of a custom function
          },
        },
        // Additional options:
        math: 'always', // Control how math is handled: 'always', 'allow-numeric', 'strict' (valid in Dart Sass)
        // Whether to enable strict math for SCSS.
        strictMath: false, // Enable strict math for calculations (true/false)
        strictUnits: false, // Enable strict units for calculations (true/false)
        watch: true, // Watch for changes in files and recompile (true/false)
        // outFile: './dist/scss', // Specify the output file name if not using gulp.dest()
        modifyVars: {
          // Modify variables directly from here
          'primary-color': '#f00', // Example: Change the primary color variable
          'secondary-color': '#0f0', // Example: Change the secondary color variable
        },
        // More options for controlling how the output is generated:
        charset: false, // Disable charset in the output (true/false)
        omitSourceMapUrl: false, // Omit source map URL in the output (true/false)
        enableSourcemap: true, // Enable sourcemaps for output (true/false)
        // You can also define custom media queries or breakpoints directly here if your setup allows.
        customMedia: {
          '--small': '(max-width: 600px)', // Define a custom media query
          '--medium': '(max-width: 900px)', // Define another custom media query
        },
        // Specify output options for advanced features
        output: {
          compress: true, // Compress output (true/false)
          yuicompress: false, // Use YUI Compressor (true/false, not applicable in Dart Sass)
        },
      }).on('error', scss.logError)
    ) // Compile SCSS and handle errors
    .pipe(postcss(plugins)) // Apply PostCSS plugins (Autoprefixer)
    .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
    .pipe(dest('./dist/scss')) // Output compiled CSS to dist folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
});

// ============================================
// Task: LESS Compilation
// ============================================

task('less', async () => {
  src('./src/less/**/*.less') // Source LESS files
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(
      less({
        // LESS options
        compress: true, // Compress output
        yuicompress: false, // Use YUI Compressor (true/false)
        strictMath: true, // Enable strict math
        strictUnits: true, // Enable strict units
        outputStyle: 'compressed', // Output style
        sourceMap: true, // Enable sourcemaps
        modifyVars: {
          // Modify variables directly from here
          'primary-color': '#f00', // Example of modifying a variable
          'secondary-color': '#00f',
        },
        plugins: [
          // Add any LESS plugins here
          // e.g., new MyLessPlugin()
        ],
        includePaths: [
          './src/less/includes', // Additional paths for imports
        ],
        relativeUrls: true, // Make URLs relative
        dumpLineNumbers: 'comments', // Dump line numbers in comments
        paths: [
          './src/less', // Additional paths for resolving @import
        ],
        filename: 'style.less', // Set the output filename
        rewriteUrls: true, // Rewrite URLs in CSS
        globalVars: {
          'font-size': '16px', // Global variable example
        },
        data: `
        @global-font-size: 16px; // Global data example
      `,
      }).on('error', console.error.bind(console))
    ) // Compile LESS and handle errors
    .pipe(postcss(plugins)) // Apply PostCSS plugins (Autoprefixer)
    .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
    .pipe(dest('./dist/less')) // Output compiled CSS to dist folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
});

// ============================================
// Task: Stylus Compilation
// ============================================

task('stylus', async () => {
  src('./src/stylus/**/*.styl') // Source Stylus files
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(
      stylus({
        compress: true, // Compress the output CSS
        sourcemap: true, // Generate sourcemaps
        include: ['./src/stylus/'], // Include path for imports
        define: {
          // Define global variables
          'primary-color': '#3498db',
          'font-size': '16px',
        },
        use: [
          /* array of plugins */
        ],
        set: {
          // Set additional variables
          'base-font-size': '16px',
        },
        inline: true, // Treat inline imports as local
        url: false, // Disable URL rewriting
        cache: true, // Enable caching
      }).on('error', console.error.bind(console))
    ) // Compile Stylus and handle errors
    .pipe(postcss(plugins)) // Apply PostCSS plugins (Autoprefixer)
    .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory
    .pipe(dest('./dist/stylus')) // Output compiled CSS to dist folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
});

// ============================================
// Task: BrowserSync Server and File Watcher
// ============================================

task('browser', async () => {
  browserSync.init({
    // Initialize BrowserSync server
    server: {
      baseDir: './dist', // Serve files from the dist directory
    },
    open: 'local', // Open the project in the browser
    port: process.env.PORT || 1000, // Use port from environment variable or default to 1000
    ui: { port: 2000 }, // Set the port for BrowserSync UI
    logPrefix: 'SASS Project', // Custom log prefix
    browser: [process.env.BROWSER || 'chrome'], // Open the project in specified browser or default to Chrome
  });

  // ============================================
  // Watchers: File Watching & Automatic Reloading
  // ============================================

  watch('./src/index.html', series('html', 'index')); // Watch HTML files and run 'html' + 'index'
  watch('./src/scss/**/*.{scss,sass}', series('scss')); // Watch SCSS files, run SCSS
  watch('./src/less/**/*.less', series('less')); // Watch LESS files, run LESS
  watch('./src/stylus/**/*.styl', series('stylus')); // Watch Stylus, run Stylus
  watch('./src/postcss/**/*.css', series('postcss')); // Watch for PostCSS files and run PostCSS task
  watch('./dist/index.html').on('change', browserSync.reload); // Reload browser on HTML change
});

// ============================================
// Default Task: Running All Tasks Together
// ============================================

// This is the default task that runs when you execute `gulp`
// It compiles HTML, SCSS, LESS, Stylus, applies PostCSS, and starts the BrowserSync server
task('default', series('html', 'index', 'scss', 'less', 'stylus', 'postcss', 'browser'));
