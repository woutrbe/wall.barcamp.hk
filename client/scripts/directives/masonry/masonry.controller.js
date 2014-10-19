(function() {
	var app = angular.module('wall.masonry');
	app.controller('MasonryController', ['$scope', function($scope, $rootScope) {
		$scope.addTimeout = null;
		$scope.itemsToAdd = [];
		$scope.prepend = false;

		// Add an elemenent to the masonry container
		$scope.addToMasonry = function(element, prepend) {
			window.clearTimeout($scope.addTimeout);

			$scope.prepend = prepend;
			$scope.itemsToAdd.push(element[0]);

			$scope.addTimeout = window.setTimeout(function() {
				if($scope.prepend) {
					$scope.msnry.prepended($scope.itemsToAdd);
				} else {
					$scope.msnry.appended($scope.itemsToAdd);
				}

				$scope.layout();

				// Reset the array with items to add
				$scope.itemsToAdd = [];
			}, 10);
		}

		// Remove an element from the masonry container
		$scope.removeFromMasonry = function(element) {
			$scope.msnry.remove(element);
			
			$scope.layout();
		}

		// Trigger masonry layout
		$scope.layout = function() {
			$scope.msnry.layout();
		}

		return $scope;
	}])
})();