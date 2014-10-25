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
	jshint		= require('gulp-jshint'),
	rename		= require("gulp-rename");

var buildDir 	= './build',
	clientDir 	= './client';

// WATCH
gulp.task('watch', function() {
	gulp.watch(clientDir + '/css/scss/**/*.scss', ['sass']);
})
gulp.task('watch-config', function() {
	gulp.watch('config/dev.config.js', ['copy-dev-config']);
})

// Build app for production
gulp.task('build', function() {
	runSequence(
		'clean-build',
		'sass',
		'copy-prod-config',
		[
			'usemin',
			'compile-templates'
		],
		'copy-server',
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

// Copy all server files to the build folder
gulp.task('copy-server', function() {
	return gulp.src('./server/**/*.*')
				.pipe(gulp.dest(buildDir + '/server'));
})
gulp.task('copy-dev-config', function() {
	return gulp.src('./config/dev.config.js')
				.pipe(rename('config.js'))
				.pipe(gulp.dest(clientDir + '/scripts/services'));
})
gulp.task('copy-prod-config', function() {
	return gulp.src('./config/prod.config.js')
				.pipe(rename('config.js'))
				.pipe(gulp.dest(clientDir + '/scripts/services'));
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

// Upload the build to an SFTP server
gulp.task('upload-build', function() {

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
gulp.task('ci', function() {
	runSequence(
		'test',
		'build'
	)
});
gulp.task('dev', ['connect-dev', 'watch', 'watch-config']);