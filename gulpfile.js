var gulp 		= require('gulp'),
	connect 	= require('gulp-connect'),
	sass		= require('gulp-sass'),
	ngHtml2Js 	= require("gulp-ng-html2js"),
	usemin		= require('gulp-usemin'),
	uglify		= require('gulp-uglify'),
	clean		= require('gulp-clean'),
	runSequence	= require('run-sequence'),
	minifyCSS	= require('gulp-minify-css'),
	concat		= require("gulp-concat");

var buildDir 	= './build',
	clientDir 	= './client';

gulp.task('default', function() {

})

gulp.task('dev', ['connect-dev', 'watch'])

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
	gulp.src(clientDir + '/css/scss/wall.scss')
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
		root: '../dist',
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

// CI
gulp.task('ci', ['build']);