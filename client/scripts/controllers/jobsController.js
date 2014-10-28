(function(window, angular, undefined) {
	var app = angular.module('wall.jobsModule', [
		'wall.dataService',
		'wall.masonry',
		'wall.infinite-scroll'
	]);

	app.controller('JobsController', ['$scope', '$rootScope', '$location', '$http', 'dataService', 'tmpJobs', 'currentCat', function($scope, $rootScope, $location, $http, dataService, tmpJobs, currentCat) {
		// tmpJobs and currentCat are passed through the routes resolve
		
		$scope.jobs = [];
		$scope.currentPage = 0;
		$scope.nextPage = 1;
		$scope.loading = false;

		if(tmpJobs.length > 0) $scope.jobs = $scope.jobs.concat(tmpJobs);

		// Triggered by the infinitife scroll directive
		// This handles loading of more jobs
		$scope.loadMore = function() {
			if($scope.loading) return;

			dataService.getJobs($scope.nextPage, currentCat.id).then(function(jobs) {
				// If the response is empty, there's no more jobs to load
				if(jobs.length == 0) {
					$scope.loading = true;
					return;
				}

				$scope.jobs = $scope.jobs.concat(jobs);

				$scope.currentPage = $scope.nextPage;
				$scope.nextPage++;

				$scope.loading = false;
			});

			$scope.loading = true;
		}

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
				prepend: true,
				isMine: true
			};

			// 2. Add the new job to our array of jobs
			$scope.jobs.unshift(newJob);
			// $scope.$apply();
		});

		// Listen to the wall.removeJob event
		$rootScope.$on('wall.removeJob', function(event, job) {
			// 1. Return a new jobs array without the given job
			$scope.jobs = _.without($scope.jobs, job);
		});

		return $scope;
	}]);
})(window, window.angular);