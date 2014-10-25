(function(window, angular, undefined) {
	// Menu directive
	var app = angular.module('wall.menuModule', ['wall.dataService']);
	app.directive('menu', ['dataService', function(dataService) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/menu/menu.html',
			controller: function($scope) {
				dataService.getMenu().then(function(data) {
					$scope.links = data;
				});

				$scope.mouseoverHandler = function(e, color) {
					angular.element(e.currentTarget)[0].style.backgroundColor = 'rgb(' + color + ')';
				};
				$scope.mouseoutHandler = function(e) {
					angular.element(e.currentTarget)[0].style.backgroundColor = 'rgb(255, 255, 255)';
				};

				return $scope;
			},
			controllerAs: 'menuCtrl'
		};
	}]);
})(window, window.angular);