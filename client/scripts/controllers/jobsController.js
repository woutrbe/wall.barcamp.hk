(function() {
	var app = angular.module('jobsModule', []);

	var jobs = [
		{
			type: 'job--hiring',
			body: 'blah blah',
			date: '2342342',
			editable: false
		},
		{
			type: 'job--looking-for-a-job',
			body: 'blah blah',
			date: '2342342',
			editable: true
		}
	]

	app.controller('JobsController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
		$scope.jobs = jobs;
		console.log($scope.jobs);

		$rootScope.$on('wall.newJob', function() {
			console.log('new job');

			var newJob = {
				type: 'job--hiring',
				body: 'test',
				date: 'test',
				editable: true
			}

			$scope.jobs.unshift(newJob);
		})

		return $scope;
	}]);
	app.run(function() {
		console.log('app.run');
	})
})();