(function(window, angular, undefined) {
	var app = angular.module('wall.faq', []);
	app.directive('faq', [function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/faq/faq.html',
			controller: 'FAQController',
			link: function(scope, element, attrs, ctrl) {
				
			}
		}
	}]);
})(window, window.angular);