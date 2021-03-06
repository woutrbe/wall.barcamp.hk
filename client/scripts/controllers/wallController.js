(function(window, angular, undefined) {
	var app = angular.module('wall.controllers', ['wall.dataService']);
	app.controller('WallController', ['$scope', '$rootScope', 'dataService', function($scope, $rootScope, dataService) {
		$scope.totalJobs = 0;

		$scope.addNewJob = function() {
			// Emit a "wall.newJob" event
			// This will be caught in jobsController
			$rootScope.$emit('wall.newJob');

			jQuery('body, html, document').animate({scrollTop: 0}, 'slow');
		};

		$scope.showLogin = function(e) {
			$rootScope.$emit('wall.showLogin');
		}

		$scope.showFaq = function(e) {
			$rootScope.$emit('wall.showFaq');
		}

		$scope.scrollTop = function(e) {
			jQuery('body, html, document').animate({scrollTop: 0}, 'slow');
		}

		$scope.toggleMenu = function() {
			$scope.menuOpen = !$scope.menuOpen;
		}

		dataService.getJobCount().then(function(data) {
			$scope.totalJobs = parseInt(data);
		})

		$rootScope.$on('wall.newJob', function() {
			$scope.overlayVisible = true;
		})
		$rootScope.$on('wall.removeJob', function(event, job) {
			$scope.overlayVisible = false;
		})
		$rootScope.$on('wall.addedJob', function() {
			$scope.overlayVisible = false;
		})

		// Listen to the wall.newJob event to create a new job
		$rootScope.$on('wall.newJob', function() {
			$scope.totalJobs++;
		});

		// Listen to the wall.removeJob event
		$rootScope.$on('wall.removeJob', function(event, job) {
			$scope.totalJobs--;
		});
	}])
})(window, window.angular);