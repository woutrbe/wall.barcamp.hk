(function(window, angular, undefined) {
	var app = angular.module('wall.requireLogin', []);
	app.directive('requireLogin', ['loginService', '$parse', function(loginService, $parse) {
		return {
			restrict: 'A',
			scope: {
				requireLogin: '&'
			},
			link: function(scope, element, attrs, ctrl) { 
				element.bind('click', function(e) {
					console.log('click');

					if(typeof scope.requireLogin === 'function') scope.requireLogin();
				})
			}
		}
	}])
})(window, window.angular);