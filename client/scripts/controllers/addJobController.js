(function() {
	// Add a new job
	var app = angular.module('wall.addJobModule', []);
	app.controller('AddJobController', function($scope, $rootScope) {
		$scope.addNewJob = function() {
			// Emit a "wall.newJob" event
			// This will be caught in jobsController
			$rootScope.$emit('wall.newJob');
		}

		return $scope;
	})
})();