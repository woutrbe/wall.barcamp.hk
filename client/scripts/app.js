(function() {
	var app = angular.module('wall', [
			'wall.routes',
			'wall.jobModule',
			'wall.jobsModule',
			'wall.jobsDetailModule',
			'wall.menuModule',
			'wall.addJobModule',
			'wall.menuSelectModule',
			'wall.notFound'
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