(function(window, angular, undefined) {
	var app = angular.module('wall.userInfo', ['wall.loginService']);
	app.directive('userInfo', ['$rootScope', function($rootScope) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/user-info/user-info.html',
			controller: 'UserInfoController',
			link: function(scope, element, attrs, ctrl) {
				$rootScope.$on('wall.login', function(event, user) {
					ctrl.onLogin(user);
				});
				$rootScope.$on('wall.logout', function(event) {
					ctrl.onLogout();
				});
			}
		};
	}]);
})(window, window.angular);