(function() {
	var app = angular.module('wall.jobsDetailModule', []);

	app.controller('JobsDetailController', ['$scope', '$rootScope', '$location', 'job', function($scope, $rootScope, $location, job) {
		// Redirect to 404 if the job doesn't exist
		if(job === undefined || job === 'null') $location.path('/404');

		$scope.job = job;
		
		return $scope;
	}])
})();