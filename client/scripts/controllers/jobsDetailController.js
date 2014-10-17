(function() {
	var app = angular.module('wall.jobsDetailModule', []);

	app.controller('JobsDetailController', ['$scope', '$rootScope', 'job', function($scope, $rootScope, job) {
		console.log(job);

		// 1. Validate if link is a string with characters and numbers

		// 2. Use dataService to send the link to the backend
		//    and return the correct information

		// 3. Create a new job directive and give it a "big" class

		// 4. Display the job directive in the DOM
		
		return $scope;
	}])
})();