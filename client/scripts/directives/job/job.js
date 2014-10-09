(function() {
	// Job directive
	var app = angular.module('wall.jobModule', ['monospaced.elastic']);
	app.directive('job', ['$sce', function($sce) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/job/job.html',
			scope: {
				job: '='
			},
			controller: function($scope, $rootScope) {
				$scope.removeable = false;
				$scope.editable = $scope.job.editable;

				if($scope.job.editable) {
					$scope.jobInput = 'Enter your post here';
					
					// Watch for changes in $scope.selectedMenu
					$scope.$watch('selectedMenu', function(newValue, oldValue) {
						if($scope.selectedMenu)	{
							console.log($scope.selectedMenu);

							$scope.type = 'job--' + $scope.selectedMenu.link.toLowerCase().replace(/ /g, '-');
							$scope.maxChars = $scope.selectedMenu.length;
						}	
					})
				} else {
					$scope.type = 'job--' + $scope.job.cat.link.toLowerCase().replace(/ /g, '-');
					$scope.content = $sce.trustAsHtml($scope.job.content);
					$scope.timestamp = $scope.job.timestamp * 1000;
				}

				$scope.createEditableJob = function() {

				}

				// Share job via email
				$scope.shareEmail = function() {
					window.alert('email');
				}
				// Share job via twitter
				$scope.shareTwitter = function() {
					window.alert('twitter');
				}
				// Remove a job
				$scope.trash = function() {
					window.alert('trash');

					$scope.removeable = true;
				}
				// Flag a job
				$scope.flag = function() {
					window.alert('flag');
				}	

				// Create a new post
				$scope.createPost = function() {
					console.log($scope.jobInput);
				}

				// Cancel creating a new post
				$scope.cancelPost = function() {
					$rootScope.$emit('wall.removeJob', $scope.job);
				}

				// Show / hide tooltip for jobs
				$scope.showTips = function() {
					$scope.expanded = true;
				}
				$scope.hideTips = function() {
					$scope.expanded = false;
				}

				return $scope;
			},
			controllerAs: 'jobCtrl'
		}
	}])
})();