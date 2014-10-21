(function() {
	var app = angular.module('wall.loginService', []);
	app.service('loginService', ['$http', '$q', function($http, $q) {
		var api = 'http://localhost/wall.barcamp.hk/server/api.php',
			serverState = null;

		return {
			init: function() {
				// Initialize oAuth
				OAuth.initialize('dptmdeRHa1H18PwexEmhVUcP4OU');
			},
			check: function() {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: api,
					data: {
						ajax: true,
						action: 'check'
					}
				}).success(function(data) {
					deferred.resolve(data);
				})

				return deferred.promise;
			},
			getServerState: function() {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: api,
					data: {
						ajax: true,
						action: 'getServerState'
					}
				}).success(function(data) {
					serverState = data;

					deferred.resolve(serverState);
				});

				return deferred.promise;
			},
			login: function(service) {
				var deferred = $q.defer();

				OAuth.popup(service, {
					state: serverState
				}).done(function(result) {
					$http({
						method: 'POST',
						url: api,
						data: {
							ajax: true,
							action: 'login',
							service: service,
							service_code: result.code
						}
					}).success(function(data) {
						deferred.resolve(data);
					});
				}).fail(function(error) {
					console.log(error);

					deferred.reject(error);
				});

				return deferred.promise;
			}
		};
	}]);
})();