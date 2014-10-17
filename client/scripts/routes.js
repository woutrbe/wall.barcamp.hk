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
				controller: 'JobsDetailController',
				resolve: {
					job: function($route, dataService) {
						return dataService.getJob($route.current.params.job)
					}
				}
			})
			.when('/new', {
				resolve: {
					new: function() {
						console.log('new');

						return false;
					}
				}
			})
			.when('/404', {
				templateUrl: 'partials/jobs-detail.html',
				controller: 'NotFoundController'
			})
			.otherwise({
				redirectTo: '/404'
			})
	})
})();