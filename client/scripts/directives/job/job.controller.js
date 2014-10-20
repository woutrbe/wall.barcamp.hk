(function() {
	var app = angular.module('wall.jobModule');
	app.controller('JobController', ['$scope', '$rootScope', '$sce', 'dataService', function($scope, $rootScope, $sce, dataService) {
		$scope.removeContent = "Are you sure you want to remove this post?";
		$scope.flagContent = "Are you sure you want to flag this post?";

		$scope.editable = ($scope.job.editable !== undefined ? $scope.job.editable : false);
		$scope.toolbar = ($scope.job.toolbar !== undefined ? $scope.job.toolbar : true);

		$scope.init = function() {
			if($scope.editable) {
				$scope.jobInput = 'Enter your post here';
				
				// Watch for changes in $scope.selectedMenu
				$scope.$watch('selectedMenu', function(newValue, oldValue) {
					if($scope.selectedMenu)	{
						$scope.job.cat = $scope.selectedMenu;

						// Set the job type as a class
						$scope.type = 'job--' + $scope.selectedMenu.safeLink;

						// Set the maximum characters
						$scope.maxChars = $scope.selectedMenu.length;
					}	
				});
			} else {
				$scope.setContent($scope.job);
			}
		};

		// Set the content of a job posting
		$scope.setContent = function(job) {
			// Generate a safe output (no HTML);
			job.safeOutput = job.content.replace(/<\/?[^>]+>/gi, '');

			// Look for the [img] tag and apply it as the background image
			var img = new RegExp(/\[img\](.*?)\[\/img\]/),
				match = job.safeOutput.match(img);

			if(match) {
				job.content = job.content.replace(img, '');
				console.log(match[1]);

				$scope.jobBackground = {
					'background': 'url(' + match[1] + ') 100% 100% no-repeat'
				}

				console.log($scope.jobBackground);
			}

			// Generate the link for this job
			var jobLink = 'http://wall.barcamp.hk/#/job/' + job.jobLink;

			// Set twitter / mail links
			$scope.twitterLink = 'http://twitter.com/home?status=' + job.safeOutput.substr(0, 50) + ' - ' + jobLink;
			$scope.mailLink = 'mailto:?body=' + job.safeOutput + ' - ' + jobLink;

			// Set the job type as a class
			$scope.type = 'job--' + job.cat.safeLink;

			// Set the content
			$scope.content = $sce.trustAsHtml(job.content.replace(/\n\r?/g, '<br />'));

			// Set the timestamp (Rendered by angular)
			$scope.timestamp = job.timestamp;
		};

		$scope.init();

		$scope.createEditableJob = function() {

		};

		// Remove a job
		$scope.trash = function() {
			$scope.removeable = true;
			$scope.toolbar = false;
		};
		// Flag a job
		$scope.flag = function() {
			$scope.flagable = true;
			$scope.toolbar = false;
		};

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

				$scope.$emit('wall.masonry.layout');
			});
		};

		// Cancel creating a new post
		$scope.cancelPost = function() {
			$rootScope.$emit('wall.removeJob', $scope.job);
		};

		// Show / hide tooltip for jobs
		$scope.showTips = function() {
			$scope.expanded = true;
		};
		$scope.hideTips = function() {
			$scope.expanded = false;
		};

		// Handling for removing posts
		$scope.confirmRemove = function() {
			dataService.removeJob($scope.job).then(function(data) {
				if(data === "true") {
					// If success, send out an event to remove the job from the DOM
					$rootScope.$emit('wall.removeJob', $scope.job);
				} else {
					// If failed, change the content of the overlay and remove the "submit" button
					$scope.removeContent = "Sorry, something went wrong, please try again later.";
					$scope.removeFailed = true;
				}
			});
		};
		$scope.cancelRemove = function() {
			$scope.removeable = false;
			$scope.toolbar = true;

			$scope.removeContent = "Are you sure you want to remove this post?";
			$scope.removeFailed = false;
		};

		// Handling for flagging posts
		$scope.confirmFlag = function() {
			dataService.flagJob($scope.job).then(function(data) {
				if(data === "true") {
					// Success, the post has been removed
					$rootScope.$emit('wall.removeJob', $scope.job);
				} else if(data === "flag") {
					// The post has been flagged, but hasn't been removed yet
					$scope.flagContent = "Thank you, one of our admins has been notified of this post.";
					$scope.flagged = true;
					$scope.flagFailed = true;
				} else {
					// If failed, change the content of the overlay and remove the "submit" button
					$scope.flagContent = "Sorry, something went wrong, please try again later.";
					$scope.flagFailed = true;
				}
			});
		};
		$scope.cancelFlag = function() {
			$scope.flagable = false;
			$scope.toolbar = true;

			$scope.flagContent = "Are you sure you want to flag this post?";
			$scope.flagFailed = false;
		};

		// Add an elemenent to the masonry container
		// This will simply emit an event, which will be handled in masonry.directive
		$scope.addToMasonry = function(element, prepend) {
			$scope.$emit('wall.masonry.addToMasonry', element, prepend);
		};

		// Remove an element from the masonry container
		// This will simply emit an event, which will be handled in masonry.directive
		$scope.removeFromMasonry = function(element) {
			$scope.$emit('wall.masonry.removeFromMasonry', element);
		};

		return $scope;
	}]);
})();