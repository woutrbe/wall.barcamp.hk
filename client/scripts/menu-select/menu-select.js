(function() {
	var app = angular.module('menuSelectModule', ['dataService']);
	app.directive('menuSelect', ['dataService', function(dataService) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/menu-select/menu-select.html',
			scope: {
				selected: '=selectedMenu'
			},
			controller: function($scope) {
				dataService.getMenu().then(function(data) {
					$scope.links = data;

					$scope.selectedLink = $scope.links[0];
					$scope.selected = $scope.selectedLink;
				});

				$scope.update = function() {
					$scope.selected = $scope.selectedLink;
				}

				return $scope;
			},
			controllerAs: 'menuSelectCtrl'
		}
	}])
})();