(function() {
	var app = angular.module('login', []);
	app.directive('login', function() {
		return {
			restrict: 'E',
			templateUrl: 'scripts/login/login.html',
			controller: function() {

			},
			controllerAs: 'loginCtrl'
		}
	})
})();