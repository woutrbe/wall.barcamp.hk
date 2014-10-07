(function() {
	// Job directive
	var app = angular.module('jobModule', []);
	app.directive('job', ['$sce', function($sce) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/job/job.html',
			scope: {
				job: '='
			},
			controller: function($scope) {
				$scope.removeable = false;
				$scope.editable = $scope.job.editable;

				if($scope.job.editable) {
					$scope.$watch('selectedMenu', function(newValue, oldValue) {
						if($scope.selectedMenu)	{
							console.log($scope.selectedMenu);

							$scope.type = 'job--' + $scope.selectedMenu.link.toLowerCase().replace(/ /g, '-');
							$scope.charLeft = $scope.selectedMenu.length;
						}	
					})
				} else {
					$scope.type = 'job--' + $scope.job.cat.link.toLowerCase().replace(/ /g, '-');
					$scope.content = $sce.trustAsHtml($scope.job.content);
					$scope.timestamp = $scope.job.timestamp * 1000;

					$scope.shareEmail = function() {
						window.alert('email');
					}
					$scope.shareTwitter = function() {
						window.alert('twitter');
					}
					$scope.trash = function() {
						window.alert('trash');

						$scope.removeable = true;
					}
					$scope.flag = function() {
						window.alert('flag');
					}
				}

				$scope.createEditableJob = function() {

				}

				return $scope;
			},
			controllerAs: 'jobCtrl'
		}
	}])
})();