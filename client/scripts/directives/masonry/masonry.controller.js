(function(window, angular, undefined) {
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
				if($scope.msnry) {
					if($scope.prepend) {
						$scope.msnry.prepended($scope.itemsToAdd);
					} else {
						$scope.msnry.appended($scope.itemsToAdd);
					}

					// $scope.layout();
				} else {
					$scope.msnry = new Masonry($scope.msnryContainer[0], {
						itemSelector: '.job-container'
					});

					// Listen to the layoutComplete event
					$scope.msnry.on('layoutComplete', function(msnryInstance, laidOutItems) {
						// Give each new element a "ready" class
						_.each(laidOutItems, function(item) {
							angular.element(item.element).addClass('ready');
						});
					});

					$scope.layout();
				}

				// Reset the array with items to add
				$scope.itemsToAdd = [];
			}, 10);
		};

		// Remove an element from the masonry container
		$scope.removeFromMasonry = function(element) {
			$scope.msnry.remove(element);
			
			$scope.layout();
		};

		// Trigger masonry layout
		$scope.layout = function() {
			$scope.msnry.layout();
		};

		return $scope;
	}]);
})(window, window.angular);