(function() {
	var app = angular.module('wall', [
			'wall.routes',
			'jobModule',
			'jobsModule',
			'wall.jobsDetailModule',
			'menuModule',
			'addJobModule',
			'menuSelectModule',
			'dataService'
		]);
	app.run(function() {
		// Initialize oAuth
		// OAuth.initialize('dptmdeRHa1H18PwexEmhVUcP4OU')
		// OAuth.popup('twitter', function(error, success) {
		// 	console.log(error);
		// 	console.log(success);
		// });
	})

	app.controller('WallController', function() {
	})
})();