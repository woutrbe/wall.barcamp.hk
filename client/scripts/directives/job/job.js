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

				$scope.init = function() {
					console.log($scope.job);

					if($scope.job.editable) {
						$scope.jobInput = 'Enter your post here';
						
						// Watch for changes in $scope.selectedMenu
						$scope.$watch('selectedMenu', function(newValue, oldValue) {
							if($scope.selectedMenu)	{
								// Set the job type as a class
								$scope.type = 'job--' + $scope.selectedMenu.link.toLowerCase().replace(/ /g, '-');

								// Set the maximum characters
								$scope.maxChars = $scope.selectedMenu.length;
							}	
						})
					} else {
						// Generate the link for this job
						var jobLink = 'http://wall.barcamp.hk/job/' + $scope.job.jobLink;

						// Set twitter / mail links
						$scope.twitterLink = 'http://twitter.com/home?status=' + $scope.job.content.substr(0, 50) + ' - ' + jobLink;
						$scope.mailLink = 'mailto:?body=' + $scope.job.content + ' - ' + jobLink;

						// Set the job type as a class
						$scope.type = 'job--' + $scope.job.cat.link.toLowerCase().replace(/ /g, '-');

						// Set the content
						$scope.content = $sce.trustAsHtml($scope.job.content);

						// Set the timestamp (Rendered by angular)
						$scope.timestamp = $scope.job.timestamp * 1000;
					}
				}

				$scope.init();

				$scope.createEditableJob = function() {

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

					// 1. Send http request to save job

					// 2. http request will return link

					$scope.editable = false;
					$scope.job.content = $scope.jobInput;
					$scope.job.timestamp = new Date().getTime();

					$scope.init();
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