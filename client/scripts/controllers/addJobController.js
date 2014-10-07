(function() {
	// Add a new job
	var app = angular.module('addJobModule', []);
	app.controller('AddJobController', function($scope, $rootScope) {
		this.addNewJob = function() {
			$rootScope.$emit('wall.newJob');
		}
	})
})();