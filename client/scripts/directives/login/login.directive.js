(function(window, angular, undefined) {
	var app = angular.module('wall.loginModule', []);
	app.directive('login', function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/login/login.html'
		};
	});
})(window, window.angular);