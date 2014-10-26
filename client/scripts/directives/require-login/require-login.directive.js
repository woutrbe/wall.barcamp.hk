(function(window, angular, undefined) {
	var app = angular.module('wall.requireLogin', []);
	app.directive('requireLogin', ['$rootScope', 'loginService', function($rootScope, loginService) {
		return {
			restrict: 'A',
			scope: {
				requireLogin: '&'
			},
			link: function(scope, element, attrs, ctrl) { 
				element.bind('click', function(e) {
					loginService.check(false).then(function(user) {
						if(user) {
							if(typeof scope.requireLogin === 'function') scope.requireLogin();
						} else {
							$rootScope.$emit('wall.showLogin');
						}
					})
				})
			}
		}
	}])
})(window, window.angular);