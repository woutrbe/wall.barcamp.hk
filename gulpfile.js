var gulp 		= require('gulp'),
	connect 	= require('gulp-connect'),
	sass		= require('gulp-sass');

gulp.task('default', function() {

})

gulp.task('dev', ['connect-dev', 'watch'])

// WATCH
gulp.task('watch', function() {
	gulp.watch('./client/css/scss/**/*.scss', ['sass']);
})

// Build app for production
gulp.task('build', function() {

})

// SASS
gulp.task('sass', function() {
	gulp.src('./client/css/scss/wall.scss')
		.pipe(sass())
		.pipe(gulp.dest('./client/css/'))
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