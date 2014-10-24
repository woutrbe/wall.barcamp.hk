(function(window, angular, undefined) {
	var app = angular.module('wall.menuSelectModule', ['wall.dataService']);
	app.directive('menuSelect', ['dataService', function(dataService) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/menu-select/menu-select.html',
			scope: {
				selected: '=selectedMenu'
			},
			controller: function($scope) {
				dataService.getMenu().then(function(data) {
					$scope.links = _.reject(data, {hideFromEditable: true});

					$scope.selectedLink = $scope.links[0];
					$scope.selected = $scope.selectedLink;
				});

				$scope.update = function() {
					$scope.selected = $scope.selectedLink;
				};

				return $scope;
			},
			controllerAs: 'menuSelectCtrl'
		};
	}]);
})(window, window.angular);