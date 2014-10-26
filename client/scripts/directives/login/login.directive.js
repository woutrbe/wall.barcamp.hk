(function(window, angular, undefined) {
	var app = angular.module('wall.login', []);
	app.directive('login', function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/login/login.html',
			controller: 'LoginController'
		};
	});
})(window, window.angular);