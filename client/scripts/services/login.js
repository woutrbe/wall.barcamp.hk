(function() {
	var app = angular.module('wall.loginService', []);
	app.service('loginService', ['$http', '$q', function($http, $q) {
		var oauth = 'http://localhost/wall.barcamp.hk/server/oauth.php';
		
		return {
			getServerState: function() {

			}
		}
	}])
})();