(function() {
	var app = angular.module('wall.userInfo');
	app.controller('UserInfoController', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
		// On startup check if we are logged in already
		loginService.check();

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
})();