(function() {
	// Add a new job
	var app = angular.module('addJobModule', []);
	app.controller('AddJobController', function($scope, $rootScope) {
		console.log('AddJobController');

		$scope.addNewJob = function() {
			$rootScope.$emit('wall.newJob');
		}

		return $scope;
	})
})();