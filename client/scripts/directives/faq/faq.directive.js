(function(window, angular, undefined) {
	var app = angular.module('wall.faq', []);
	app.directive('faq', ['$rootScope', function($rootScope) {
		return {
			restrict: 'E',
			scope: true,
			templateUrl: 'scripts/directives/faq/faq.html',
			controller: 'FAQController',
			link: function(scope, element, attrs, ctrl) {
				$rootScope.$on('wall.showFaq', function() {
					jQuery('body, html, document').animate({scrollTop: 0}, 'slow');
					
					ctrl.showFaq();
				})
			}
		}
	}]);
})(window, window.angular);