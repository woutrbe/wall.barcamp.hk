(function() {
	var app = angular.module('wall.masonry', []);
	app.directive('masonry', [function() {
		return {
			restrict: 'A',
			scope: true,
			link: function(scope, element, attrs, ctrl) {
				scope.msnry = new Masonry(element[0], {
					itemSelector: '.job-container'
				})

				scope.$on('wall.masonry.addToMasonry', function(event, element) {
					ctrl.addToMasonry(element);
				})

				scope.$on('wall.masonry.removeFromMasonry', function(event, element) {
					ctrl.removeFromMasonry(element);
				})

				scope.$on('wall.masonry.layout', function(event) {
					ctrl.layout();
				})
			},
			controller: 'MasonryController'
		}
	}])
})();