(function() {
	var app = angular.module('wall', [
			'ngRoute',
			'jobModule',
			'jobsModule',
			'menuModule',
			'dataService'
		]);
	app.run(function() {
		// Initialize oAuth
		OAuth.initialize('dptmdeRHa1H18PwexEmhVUcP4OU');

		console.log(OAuth);
		// OAuth.popup('twitter').done(function(result) {
		// 	console.log(result);
		// })
	})

	app.controller('WallController', function() {
	})

	// Add a new job
	app.controller('AddJobController', function($scope, $rootScope) {
		console.log($scope);
		console.log($rootScope);

		this.addNewJob = function() {
			$rootScope.$emit('wall.newJob');
		}
	})
})();