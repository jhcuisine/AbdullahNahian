// Import core Gulp modules
import { task, src, dest, watch, series, parallel, tree } from 'gulp';

// Import Gulp plugins
import gulpSass from 'gulp-sass';
import less from 'gulp-less';
import stylus from 'gulp-stylus';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import typescript from 'gulp-typescript';

// Import PostCSS plugins
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// Import compilers
import * as dartSass from 'sass';
// import lessCompiler from 'less';
// import sassCompiler from 'sass';
// import stylusCompiler from 'stylus';

// Setup SASS with Dart SASS compiler
const sass = gulpSass(dartSass);

// Define PostCSS processors
const postcssProcessors = [
  autoprefixer({
    env: 'production',
    grid: 'autoplace',
    flexbox: 'no-2009',
    cascade: false,
    overrideBrowserslist: 'last 100 versions',
  }),
  // Uncomment if you need minification
  // cssnano({ preset: 'advanced' }),
];

// SASS task
task('sass', () => {
  return src('./src/scss/**/*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssProcessors))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/scss'));
});

// LESS task
task('less', () => {
  return src('./src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss(postcssProcessors))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/less'));
});

// Stylus task
task('stylus', () => {
  return src('./src/stylus/**/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(postcss(postcssProcessors))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/stylus'));
});

// PostCSS task
task('postcss', () => {
  return src('./src/postcss/**/*.{css,pcss}')
    .pipe(sourcemaps.init())
    .pipe(postcss(postcssProcessors))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/postcss'));
});

// TypeScript task
task('typescript', () => {
  return src('./src/ts/**/*.{ts,tsx}')
    .pipe(typescript())
    .pipe(dest('./dist/ts'));
});
