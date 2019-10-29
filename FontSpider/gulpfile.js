const gulp = require('gulp')
const fontSpider = require('gulp-font-spider')

gulp.task('Han', function () {
    return gulp.src('./han.html')
        .pipe(fontSpider())
})

gulp.task('FZ', function () {
    return gulp.src('./fz.html')
        .pipe(fontSpider())
})
