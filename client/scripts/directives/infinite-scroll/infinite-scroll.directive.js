(function() {
	var app = angular.module('wall.infinite-scroll', []);
	app.directive('infiniteScroll', [function() {
		return {
			restrict: 'A',
			scope: true,
			controller: 'InfiniteScrollController'
		};
	}]);
})();