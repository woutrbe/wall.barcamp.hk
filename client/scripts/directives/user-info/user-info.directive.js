(function() {
	var app = angular.module('wall.userInfo', []);
	app.directive('userInfo', [function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/user-info/user-info.html',
			controller: 'UserInfoController',
			link: function(scope, element, attrs, ctrl) {
				scope.$on('wall.login', function(event, user) {
					ctrl.onLogin(user);
				});
				scope.$on('wall.logout', function(event) {
					ctrl.onLogout();
				});
			}
		};
	}]);
})();