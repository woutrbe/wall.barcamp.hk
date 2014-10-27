(function(window, angular, undefined) {
	var app = angular.module('wall.login');
	app.controller('LoginController', ['$scope', '$rootScope', 'loginService', function($scope, $rootScope, loginService) {
		var show = function() {
			$scope.loginActive = true;
		}
		var hide = function() {
			$scope.loginActive = false;
		}

		$scope.showLogin = function() {
			show();
		}
		$scope.hideLogin = function() {
			hide();
		}
		$scope.login = function(service) {
			loginService.getServerState().then(function(state) {
				console.log(state);

				loginService.login('twitter').then(function(data) {
					console.log(data);

					loginService.check().then(function(data) {
						console.log(data);
					})
				})
			})
		}

		return $scope;
	}]);
})(window, window.angular);