(function(window, angular, undefined) {
	var app = angular.module('wall.infinite-scroll', []);
	app.directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
		return {
			restrict: 'A',
			scope: {
				infiniteScroll: '&'
			},
			link: function(scope, elem, attrs) {
				var windowEl = angular.element($window),
					container = angular.element(elem),
					timeout = null,

					onScroll = function() {
						$timeout.cancel(timeout);
						
						timeout = $timeout(function() {
							if(windowEl.scrollTop() + windowEl.height() >= container.height() - 250) scope.infiniteScroll();
						}, 500);
					}

				windowEl.bind('scroll', onScroll);
			}
		};
	}]);
})(window, window.angular);