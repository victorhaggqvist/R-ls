
var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');
var eslint = require('gulp-eslint');

gulp.task('sass', function () {
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

gulp.task('pack', function(callback) {
    return gulp.src('./js/Rels.js')
        .pipe(webpack({
            output: {
                filename: 'Rels.min.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel' },
                    { test: /\.js$/, loader: 'msx' }
                ]
            }
        }))
        .pipe(gulp.dest('./web/js'));
});

gulp.task('pack:watch', function(callback) {
    return gulp.src('./js/Rels.js')
        .pipe(webpack({
            watch: true,
            output: {
                filename: 'Rels.min.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel' },
                    { test: /\.js$/, loader: 'msx' }
                ]
            }
        }))
        .pipe(gulp.dest('./web/js'));
});

gulp.task('eslint', function() {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
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
    gulp.src(['./node_modules/mithril/mithril.min.js']).pipe(gulp.dest('./web/js'));
});

gulp.task('build', ['fonts', 'style', 'jquery', 'script']);

gulp.task('default', function () {
    gulp.start('build');
});

gulp.task('watch', function() {
    gulp.watch('js/**/*', ['pack:watch']);
    gulp.watch('style/**/*', ['sass']);
});
