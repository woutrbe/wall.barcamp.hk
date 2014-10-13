(function() {
	// Menu directive
	var app = angular.module('wall.menuModule', ['wall.dataService']);
	app.directive('menu', ['dataService', function(dataService) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/menu/menu.html',
			controller: function($scope) {
				$scope.links = [
					{
						color: '242, 90, 149',
						id: '0',
						link: 'View all'
					}
				];

				dataService.getMenu().then(function(data) {
					$scope.links = $scope.links.concat(data);
				})

				$scope.sort = function(sortBy) {
					window.alert('sort by: ' + sortBy);
				}

				$scope.mouseoverHandler = function(e, color) {
					// angular.element(e.srcElement).style.backgroundColor = color;
				}
				$scope.mouseoutHandler = function(e) {

				}

				return $scope;
			},
			controllerAs: 'menuCtrl'
		}
	}])
})();