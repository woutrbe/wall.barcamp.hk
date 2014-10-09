(function() {
	var app = angular.module('wall.routes', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/jobs-list.html',
				controller: 'JobsController'
			})
			.when('/job/:job', {
				templateUrl: 'partials/jobs-detail.html',
				controller: 'JobsDetailController'
			})
			.when('/new', {
				template: '',
				controller: 'AddJobController'
			})
			.otherwise({
				redirectTo: '/'
			})
	})
})();