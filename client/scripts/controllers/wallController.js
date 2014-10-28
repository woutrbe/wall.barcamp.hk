(function(window, angular, undefined) {
	var app = angular.module('wall.controllers', []);
	app.controller('WallController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.addNewJob = function() {
			// Emit a "wall.newJob" event
			// This will be caught in jobsController
			$rootScope.$emit('wall.newJob');
		};

		$scope.showLogin = function(e) {
			$rootScope.$emit('wall.showLogin');
		}

		$scope.showFaq = function(e) {
			$scope.scrollTop(null);

			$rootScope.$emit('wall.showFaq');
		}

		$scope.scrollTop = function(e) {
			jQuery('body, html, document').animate({scrollTop: 0}, 'slow');
		}
	}])
})(window, window.angular);