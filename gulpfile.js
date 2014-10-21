var gulp 		= require('gulp'),
	connect 	= require('gulp-connect'),
	sass		= require('gulp-sass'),
	ngHtml2Js 	= require("gulp-ng-html2js"),
	usemin		= require('gulp-usemin'),
	uglify		= require('gulp-uglify'),
	clean		= require('gulp-clean'),
	runSequence	= require('run-sequence'),
	minifyCSS	= require('gulp-minify-css'),
	concat		= require('gulp-concat'),
	jshint		= require('gulp-jshint');

var buildDir 	= './build',
	clientDir 	= './client';

// WATCH
gulp.task('watch', function() {
	gulp.watch(clientDir + '/css/scss/**/*.scss', ['sass']);
})

// Build app for production
gulp.task('build', function() {
	runSequence(
		'clean-build',
		'sass',
		[
			'usemin',
			'compile-templates'
		],
		'copy-images'
	)
})

// SASS
gulp.task('sass', function() {
	return gulp.src(clientDir + '/css/scss/wall.scss')
			.pipe(sass())
			.pipe(gulp.dest(clientDir + '/css/'))
			.pipe(connect.reload());
})

// Connect to server
gulp.task('connect-dev', function() {
	connect.server({
		root: 'client',
		livereload: true,
		port: 3000
	})
})
gulp.task('connect-dist', function() {
	connect.server({
		root: 'build',
		port: 3001
	})
})

// Clean the build folder
gulp.task('clean-build', function() {
	return gulp.src(buildDir)
				.pipe(clean());
})

// Copy images to the build folder
gulp.task('copy-images', function() {
	return gulp.src(clientDir + '/img/*.*')
				.pipe(gulp.dest(buildDir + '/img'));
})

// usemin
gulp.task('usemin', function() {
	return gulp.src(clientDir + '/index.html')
				.pipe(usemin({
					js: [],
					css: [minifyCSS({
						keepSpecialComments: 0
					})]
				}))
				.pipe(gulp.dest(buildDir));
})

// Compile angular templates to javascript
gulp.task('compile-templates', function() {
	return gulp.src([
					clientDir + '/**/*.html',
					'!' + clientDir + '/scripts/libs/**/*.html',
					'!' + clientDir + '/index.html'
				])
			.pipe(ngHtml2Js({
				moduleName: 'wall.partials'
			}))
			.pipe(concat('partials.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(buildDir + '/scripts'))
})

// JSHint - Check for JS code quality
gulp.task('jshint', function() {
	return gulp.src([
					clientDir + '/scripts/**/*.js',
					'!' + clientDir + '/scripts/libs/**/*.js'
				])
				.pipe(jshint())
				.pipe(jshint.reporter('default'));
})

// CI
gulp.task('test', ['jshint']);
gulp.task('ci', ['test', 'build']);
gulp.task('dev', ['connect-dev', 'watch']);