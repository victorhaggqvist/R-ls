
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('style', function () {
    return gulp.src('style/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/',
                './bower_components/bootswatch/'
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('./web/css'));
});

gulp.task('fonts', function () {
    return gulp.src(['./bower_components/bootstrap-sass/assets/fonts/bootstrap/*']).pipe(gulp.dest('./web/fonts'));
});

gulp.task('jquery', function () {
    return gulp.src(['./bower_components/jquery/dist/jquery.min.js']).pipe(gulp.dest('./web/js'));
});

gulp.task('script', function () {
    gulp.src(['./bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js']).pipe(gulp.dest('./web/js'));
    gulp.src(['./bower_components/typeahead.js/dist/typeahead.bundle.min.js']).pipe(gulp.dest('./web/js'));
});

gulp.task('build', ['fonts', 'style', 'jquery', 'script']);

gulp.task('default', function () {
    gulp.start('build');
});
