(function() {
	var app = angular.module('wall.userInfo');
	app.controller('UserInfoController', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
		// On startup check if we are logged in already
		loginService.check().then(function(data) {
			console.log(data);
		})

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