(function(window, angular, undefined) {
	var app = angular.module('wall.infinite-scroll', []);
	app.directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
		return {
			restrict: 'A',
			scope: {
				infiniteScroll: '&'
			}
		};
	}]);
})(window, window.angular);