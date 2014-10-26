(function(window, angular, undefined) {
	var app = angular.module('wall.login');
	app.controller('LoginController', ['$scope', '$rootScope', function($scope, $rootScope) {
		var show = function() {

		}
		var hide = function() {

		}

		$rootScope.$on('wall.showLogin', function(event) {
			
		});		

		return $scope;
	}]);
})(window, window.angular);