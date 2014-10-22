(function() {
	var app = angular.module('wall.userInfo');
	app.controller('UserInfoController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.isLoggedIn = false;

		$scope.onLogin = function(user) {
			$scope.isLoggedIn = true;

			$scope.user = user;
		}
		$scope.onLogout = function() {
			$scope.isLoggedIn = false;
		}

		return $scope;
	}])
})();