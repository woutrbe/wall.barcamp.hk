(function(window, angular, undefined) {
	var app = angular.module('wall.config', []);
	app.service('configService', [function() {
		return {
			api: '../server/api.php'
		}
	}])
})(window, window.angular);