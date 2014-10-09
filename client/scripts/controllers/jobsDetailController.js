(function() {
	var app = angular.module('wall.jobsDetailModule', ['wall.dataService']);

	app.controller('JobsDetailController', ['$scope', '$rootScope', 'dataService', function($scope, $rootScope, dataService) {
		console.log('jobs detal controller');
		return $scope;
	}])
})();