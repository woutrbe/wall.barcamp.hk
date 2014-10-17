(function() {
	var app = angular.module('wall.routes', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider
			// By default, redirect to /filter/all
			.when('/', {
				redirectTo: '/filter/all'
			})
			.when('/filter/:filter', {
				templateUrl: 'partials/jobs-list.html',
				controller: 'JobsController',
				resolve: {
					// 1. Get all menu items

					// 2. Validate the given filter

					// 3. Load jobs with this filter
					tmpJobs: function($route, dataService) {
						console.log($route.current.params.filter);
						return dataService.getJobs(0);
					},
					menu: function(dataService) {
						return dataService.getMenu();
					}
				}
			})
			.when('/job/:job', {
				templateUrl: 'partials/jobs-detail.html',
				controller: 'JobsDetailController',
				resolve: {
					job: function($route, dataService) {
						// Check if job actually exists
						return dataService.getJob($route.current.params.job);
					},
					menu: function(dataService) {
						return dataService.getMenu();
					}
				}
			})
			.when('/new', {
				redirectTo: '/#new'
			})
			.when('/404', {
				templateUrl: 'partials/jobs-detail.html',
				controller: 'NotFoundController',
				resolve: {
					menu: function(dataService) {
						return dataService.getMenu();
					}
				}
			})
			// Redirect to 404 page in case of anything else
			.otherwise({
				redirectTo: '/404'
			})
	})
})();