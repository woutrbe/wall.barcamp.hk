(function(window, angular, undefined) {
	var app = angular.module('wall.masonry', []);
	app.directive('masonry', [function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs, ctrl) {
				scope.msnryContainer = element;
				scope.$on('wall.masonry.addToMasonry', function(event, element, prepend) {
					ctrl.addToMasonry(element, prepend);
				});

				scope.$on('wall.masonry.removeFromMasonry', function(event, element) {
					ctrl.removeFromMasonry(element);
				});

				scope.$on('wall.masonry.layout', function(event) {
					ctrl.layout();
				});
			},
			controller: 'MasonryController'
		};
	}]);
})(window, window.angular);