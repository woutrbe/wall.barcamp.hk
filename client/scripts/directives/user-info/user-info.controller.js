(function(window, angular, undefined) {
	var app = angular.module('wall.userInfo');
	app.controller('UserInfoController', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
		$scope.isLoggedIn = false;

		$scope.onLogin = function(user) {
			$scope.isLoggedIn = true;

			$scope.user = user;
		};
		$scope.onLogout = function() {
			$scope.isLoggedIn = false;
		};

		$scope.logout = function() {
			loginService.logout();
		};

		return $scope;
	}]);
})(window, window.angular);