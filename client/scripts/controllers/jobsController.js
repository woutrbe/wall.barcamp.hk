(function() {
	var app = angular.module('wall.jobsModule', ['wall.dataService']);

	app.controller('JobsController', ['$scope', '$rootScope', '$http', 'dataService', function($scope, $rootScope, $http, dataService) {
		$scope.jobs = [];
		dataService.getJobs(0).then(function(jobs) {
			$scope.matchJobWithMenu(jobs);
		})

		// Listen to the wall.newJob event to create a new job
		$rootScope.$on('wall.newJob', function() {
			var newJob = {
				catID: 0,
				content: 'test',
				timestamp: new Date().getTime(),
				link: '',
				editable: true,
				removeable: false
			}

			$scope.jobs.unshift(newJob);
		})

		// Listen to the wall.removeJob event
		$rootScope.$on('wall.removeJob', function(event, job) {
			console.log($scope.jobs.indexOf(job));

			$scope.jobs = _.without($scope.jobs, job);
		})

		// Match our jobs with the corresponding menu item
		$scope.matchJobWithMenu = function(jobs) {
			dataService.getMenu().then(function(links) {
				var tmpJob = {};
				for(var i = 0; i < jobs.length; i++) {
					tmpJob = jobs[i];
					
					var cat = _.filter(links, {id: tmpJob.catID.toString()});
					tmpJob.cat = cat[0];

					$scope.jobs.push(tmpJob);
				}
			})
		}

		return $scope;
	}]);
})();