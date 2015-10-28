var pkg = require('./package.json');
var gulp = require('gulp');
var banner = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var pages = require('gulp-gh-pages');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var browserifyConfig = {
    entries: ['./index.js'],
    standalone: pkg.buildId
};

gulp.task('cleanDist', function() {
    return gulp.src('dist/**/*.js', {
            read: false
        }).pipe(clean());
});

gulp.task('cleanLib', function() {
    return gulp.src('lib/**/*.js', {
            read: false
        }).pipe(clean());
});

gulp.task('es5ify', ['cleanLib'], function () {
    return gulp.src('src/*.js')
      .pipe(babel({
         loose: true,
         blacklist: ['spec.functionName']
       }))
      .pipe(gulp.dest('lib'));
});

gulp.task('browserify', ['es5ify', 'cleanDist'], function() {
    return browserify(browserifyConfig)
        .bundle()
        .pipe(source(pkg.buildId + '.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('compress', ['browserify'], function() {
    return gulp.src('dist/' + pkg.buildId + '.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(banner('/**! ' + pkg.buildId + '.js v' + pkg.version + ' - ' + pkg.copyright + ' */\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['cleanDist', 'cleanLib', 'es5ify', 'browserify', 'compress']);
