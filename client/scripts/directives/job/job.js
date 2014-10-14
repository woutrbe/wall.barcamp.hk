(function() {
	// Job directive
	var app = angular.module('wall.jobModule', ['monospaced.elastic', 'wall.dataService']);
	app.directive('job', ['$sce', 'dataService', function($sce, dataService) {
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
					if($scope.job.editable) {
						$scope.jobInput = 'Enter your post here';
						
						// Watch for changes in $scope.selectedMenu
						$scope.$watch('selectedMenu', function(newValue, oldValue) {
							if($scope.selectedMenu)	{
								$scope.job.cat = $scope.selectedMenu;

								// Set the job type as a class
								$scope.type = 'job--' + $scope.selectedMenu.link.toLowerCase().replace(/ /g, '-');

								// Set the maximum characters
								$scope.maxChars = $scope.selectedMenu.length;
							}	
						})
					} else {
						$scope.setContent($scope.job);
					}
				}

				// Set the content of a job posting
				$scope.setContent = function(job) {
					// Generate the link for this job
					var jobLink = 'http://wall.barcamp.hk/job/' + job.jobLink;

					// Set twitter / mail links
					$scope.twitterLink = 'http://twitter.com/home?status=' + job.content.substr(0, 50) + ' - ' + jobLink;
					$scope.mailLink = 'mailto:?body=' + job.content + ' - ' + jobLink;

					// Set the job type as a class
					$scope.type = 'job--' + job.cat.link.toLowerCase().replace(/ /g, '-');

					// Set the content
					$scope.content = $sce.trustAsHtml(job.content);

					// Set the timestamp (Rendered by angular)
					$scope.timestamp = job.timestamp;
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
					var content = $scope.jobInput,
						catID = $scope.selectedMenu.id;

					$scope.editable = false;
					$scope.job.timestamp = new Date().getTime();

					dataService.saveJob(content, catID).then(function(data) {
						// Set the jobID, jobLink and contetn returned by the api call
						$scope.job.jobID = data.jobID;
						$scope.job.jobLink = data.link;
						$scope.job.content = data.content;

						// Re set the content
						$scope.setContent($scope.job);
					})
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