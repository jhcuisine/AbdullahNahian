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

const plugins = [
  autoprefixer({
    grid: 'autoplace',
    overrideBrowserslist: 'last 100 versions',
    cascade: false,
    flexbox: 'no-2009',
  }),
];

task('index', async () => {
  src('./dist/index.html')
    .pipe(
      inject(src('./dist/**/*.css', { read: false }), {
        ignorePath: 'dist',
        addRootSlash: false,
        removeTags: true,
      })
    )
    .pipe(
      inject(src('./dist/**/*.js', { read: false }), {
        ignorePath: 'dist',
        addRootSlash: false,
        removeTags: true,
      })
    )
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
});

task('html', () =>
  src('src/index.html')
    .pipe(template({ name: 'Sindre' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
);

task('scss', async () => {
  src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
});

task('less', async () => {
  src('./src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', less.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
});

task('stylus', async () => {
  src('./src/stylus/**/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus().on('error', stylus.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
});

task('browser', async () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    open: 'local',
    port: 1000,
    ui: {
      port: 2000,
    },
    logPrefix: 'SASS Project',
    browser: ['chrome'],
  });
  watch('./src/index.html', series('html', 'index'));
  watch('./src/scss/**/*.{scss, sass}', series('scss'));
  watch('./src/less/**/*.less', series('less'));
  watch('./src/stylus/**/*.styl', series('stylus'));
  watch('./dist/index.html').on('change', browserSync.reload);
});

task('default', series('html', 'index', 'scss', 'less', 'stylus', 'browser'));
