(function(window, angular, undefined) {
	var app = angular.module('wall.jobsModule', [
		'wall.dataService',
		'wall.masonry'
	]);

	app.controller('JobsController', ['$scope', '$rootScope', '$location', '$http', 'dataService', 'tmpJobs', 'menu', function($scope, $rootScope, $location, $http, dataService, tmpJobs, menu) {
		$scope.jobs = [];

		$scope.$on('$routeUpdate',function(){
			console.log($location.search());
			console.log($location.hash());
		});

		// Match our jobs with the corresponding menu item
		$scope.matchJobWithMenu = function(jobs, menu) {
			var tmpJob = {};
			for(var i = 0; i < jobs.length; i++) {
				tmpJob = jobs[i];
				
				var cat = _.filter(menu, {id: tmpJob.catID.toString()});
				tmpJob.cat = cat[0];

				$scope.jobs.push(tmpJob);
			}
		};

		// Triggered by the infinitife scroll directive
		// This handles loading of more jobs
		$scope.loadMore = function() {

		}
		
		$scope.matchJobWithMenu(tmpJobs, menu);

		// Listen to the wall.newJob event to create a new job
		$rootScope.$on('wall.newJob', function() {
			// 1. Create an empty job
			var newJob = {
				catID: 0,
				content: 'test',
				timestamp: new Date().getTime(),
				link: '',
				editable: true,
				removeable: false,
				prepend: true
			};

			// 2. Add the new job to our array of jobs
			$scope.jobs.unshift(newJob);
			$scope.$apply();
		});

		// Listen to the wall.removeJob event
		$rootScope.$on('wall.removeJob', function(event, job) {
			// 1. Return a new jobs array without the given job
			$scope.jobs = _.without($scope.jobs, job);
		});

		return $scope;
	}]);
})(window, window.angular);