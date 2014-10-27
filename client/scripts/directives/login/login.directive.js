(function(window, angular, undefined) {
	var app = angular.module('wall.login', []);
	app.directive('login', ['$rootScope', function($rootScope) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/login/login.html',
			controller: 'LoginController',
			link: function(scope, element, attrs, ctrl) {
				$rootScope.$on('wall.showLogin', function(event) {
					ctrl.showLogin();
				});	
				$rootScope.$on('wall.login', function(event, user) {
					ctrl.hideLogin();
				});
			}
		};
	}]);
})(window, window.angular);