'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');

// compile sass
gulp.task('sass', () => {
    return gulp.src('./demo/src/scss/*.scss')
        .pipe(
            sass({
                outputStyle: 'expanded'
            }).on('error', sass.logError)
        )
        .pipe(
            gulp.dest('./demo/src/css')
        );
});

// watch for file changes
gulp.task('watch', () => {
    gulp.watch('./demo/src/scss/*.scss', ['sass']);
});

// default
gulp.task('default', [
    'sass',
    'watch'
]);