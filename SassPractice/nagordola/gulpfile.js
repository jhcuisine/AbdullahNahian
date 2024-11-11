import gulp from 'gulp'
const { src, dest, task, watch, series } = gulp
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import browserSync from 'browser-sync'
import sourcemaps from 'gulp-sourcemaps'
import template from 'gulp-template'
import inject from 'gulp-inject'
import babel from 'gulp-babel'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import htmlmin from 'gulp-htmlmin'
const plugins = [
  autoprefixer({
    grid: 'autoplace',
    overrideBrowserslist: 'last 100 versions',
    cascade: false,
    flexbox: 'no-2009',
  }),
  // cssnano({ preset: 'advanced' }),
]

task('html', () =>
  src('src/index.html')
    .pipe(template())
    // .pipe(
    //   htmlmin({
    //     collapseWhitespace: true,
    //     removeComments: true,
    //     minifyJS: true,
    //     minifyCSS: true,
    //   })
    // )
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
)

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
    .pipe(browserSync.stream())
})

task('scss', async () => {
  src('./src/scss/**/*.{scss, sass}')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream())
})

task('js', async () => {
  src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/js'))
    .pipe(browserSync.stream())
})

task('img', async () => {
  src('./src/img/**/*').pipe(dest('./dist/img'))
})

task('server', async () => {
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
    logLevel: 'info',
    logConnections: true,
    logFileChanges: true,
    browser: ['chrome'],
    notify: true,
    online: true,
  })
  watch('./src/index.html', series('html', 'index'))
  watch('./src/scss/**/*.{scss, sass}', series('scss'))
  watch('./src/js/**/*.js', series('js'))
  watch('./dist/index.html').on('change', browserSync.reload)
})

task('default', series('html', 'index', 'scss', 'js', 'img', 'server'))
