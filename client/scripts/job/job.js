(function() {
	// Job directive
	var app = angular.module('jobModule', []);
	app.directive('job', function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/job/job.html',
			controller: function($scope) {
				console.log('Editable: ' + $scope.editable);

				$scope.shareEmail = function() {
					window.alert('email');
				}
				$scope.shareTwitter = function() {
					window.alert('twitter');
				}
				$scope.trash = function() {
					window.alert('trash');
				}
				$scope.flag = function() {
					window.alert('flag');
				}

				return $scope;
			},
			controllerAs: 'jobCtrl'
		}
	})
})();