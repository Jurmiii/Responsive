var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var focus = require('postcss-focus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');


// Transpiling LESS to CSS, autoprefix, minifying, sourcemaps and :focus plugin
gulp.task('css', function () {
    console.log("Transpiling LESS to CSS, autoprefix, minifying, sourcemaps and :focus plugin");
    return gulp.src('./style.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([ require('postcss-focus') ]))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./**/*.less', ['css']);
});

// gulp.task('default', ['css', 'movingBootstrapJS', 'scriptsConcat']);
gulp.task('default', ['css']);