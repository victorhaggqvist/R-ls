
var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');
var wp = require('webpack');
var eslint = require('gulp-eslint');
var spritesmith = require('gulp.spritesmith');
var csso = require('gulp-csso');
var merge = require('merge-stream');
var imagemin = require('gulp-imagemin');

gulp.task('sass', function () {
    return gulp.src('style/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                './bower_components/bootstrap-sass/assets/stylesheets/bootstrap/',
                './bower_components/bootswatch/'
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('./web/css'));
});

gulp.task('pack', function() {
    return gulp.src('./js/Rels.js')
        .pipe(webpack({
            output: {
                filename: 'Rels.min.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel' }
                ]
            }
        }))
        .pipe(gulp.dest('./web/js'));
});

gulp.task('pack:dist', function() {
    return gulp.src('./js/Rels.js')
        .pipe(webpack({
            output: {
                filename: 'Rels.min.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel' }
                ]
            },
            plugins: [new wp.optimize.UglifyJsPlugin()]
        }))
        .pipe(gulp.dest('./web/js'));
});

gulp.task('pack:watch', function() {
    return gulp.src('./js/Rels.js')
        .pipe(webpack({
            watch: true,
            output: {
                filename: 'Rels.min.js'
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'babel' }
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

gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = gulp.src('sprites/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(imagemin())
        .pipe(gulp.dest('./web/i'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest('./web/i'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('copy', function () {
    gulp.src(['./bower_components/bootstrap-sass/assets/fonts/bootstrap/*']).pipe(gulp.dest('./web/fonts'));
    gulp.src(['./bower_components/jquery/dist/jquery.min.js']).pipe(gulp.dest('./web/js'));
    gulp.src(['./bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js']).pipe(gulp.dest('./web/js'));
    gulp.src(['./bower_components/typeahead.js/dist/typeahead.bundle.min.js']).pipe(gulp.dest('./web/js'));
    gulp.src(['./bower_components/moment/min/moment-with-locales.min.js']).pipe(gulp.dest('./web/js'));
    gulp.src(['./node_modules/lovefield/dist/lovefield.min.js']).pipe(gulp.dest('./web/js'));

    gulp.src(['./bower_components/mapbox.js/mapbox.js']).pipe(gulp.dest('./web/mapbox'));
    gulp.src(['./bower_components/mapbox.js/mapbox.css']).pipe(gulp.dest('./web/mapbox'));
    gulp.src(['./bower_components/mapbox.js/images/*']).pipe(gulp.dest('./web/mapbox/images'));
    gulp.src(['./img/*']).pipe(gulp.dest('./web/img'));
});

gulp.task('build', ['copy', 'pack:dist', 'sprite', 'sass']);

gulp.task('default', function () {
    gulp.start('build');
});

gulp.task('watch', function() {
    gulp.watch('js/**/*', ['pack:watch']);
    gulp.watch('style/**/*', ['sass']);
});
