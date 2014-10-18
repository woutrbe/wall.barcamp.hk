(function() {
	var app = angular.module('wall', [
			'wall.routes',
			'wall.jobModule',
			'wall.jobsModule',
			'wall.jobsDetailModule',
			'wall.menuModule',
			'wall.addJobModule',
			'wall.menuSelectModule',
			'wall.notFound',
			'wall.partials'
		]);
	app.run(function() {
		// Initialize oAuth
		// OAuth.initialize('dptmdeRHa1H18PwexEmhVUcP4OU')
		// OAuth.popup('twitter', function(error, success) {
		// 	console.log(error);
		// 	console.log(success);
		// });
	})

	// Setup for partials that are compiled during the build process
	try {
		var partials = angular.module('wall.partials');
	} catch (e) {
		var partials = angular.module('wall.partials', []);
	}
})();