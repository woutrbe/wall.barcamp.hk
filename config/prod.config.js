(function(window, angular, undefined) {
	var app = angular.module('wall.config', []);
	app.service('configService', [function() {
		return {
			api: 'http://localhost/wall.barcamp.hk/server/apiasdfas.php'
		}
	}])
})(window, window.angular);