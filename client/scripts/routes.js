(function(window, angular, undefined) {
	var app = angular.module('wall.routes', ['ngRoute']);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		// $locationProvider.html5Mode(true);

		$routeProvider
			// By default, redirect to /filter/all
			.when('/', {
				redirectTo: '/filter/all'
			})
			.when('/filter/:filter', {
				templateUrl: 'partials/jobs-list.html',
				controller: 'JobsController',
				resolve: {
					tmpJobs: function($route, $q, $location, dataService) {
						var jobsQ = $q.defer();

						dataService.getMenu().then(function(links) {
							var currentCat = _.findWhere(links, {safeLink: $route.current.params.filter});

							if(currentCat === undefined) {
								// If the given category doesn't exist, reject the promise
								// And redirect to 404
								jobsQ.reject();

								$location.path('404');
							} else {
								// Category exists, grab all the jobs from that category
								dataService.getJobs(0, currentCat.id).then(function(jobs) {
									jobsQ.resolve(jobs);
								});
							}
						});

						return jobsQ.promise;
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
			});
	}]);
})(window, window.angular);