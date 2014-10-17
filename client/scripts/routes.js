(function() {
	var app = angular.module('wall.routes', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/jobs-list.html',
				controller: 'JobsController',
				resolve: {
					tmpJobs: function(dataService) {
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
				resolve: {
					new: function() {
						console.log('new');

						return false;
					}
				}
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
			.otherwise({
				redirectTo: '/404'
			})
	})
})();