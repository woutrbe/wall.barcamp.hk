(function() {
	var app = angular.module('wall.jobsDetailModule', []);

	app.controller('JobsDetailController', ['$scope', '$rootScope', '$location', 'job', function($scope, $rootScope, $location, job) {
		// Redirect to 404 if the job doesn't exist
		if(job === undefined || job === 'null') $location.path('/404');

		// Set a safe link for the category
		job.cat.safeLink = job.cat.link.toLowerCase().replace(/ /g, '-');

		$scope.job = job;
		
		return $scope;
	}])
})();