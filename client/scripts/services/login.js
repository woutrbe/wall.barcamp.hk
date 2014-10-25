(function(window, angular, undefined) {
	var app = angular.module('wall.loginService', ['wall.config']);
	app.factory('loginService', ['$http', '$rootScope', '$q', 'configService', function($http, $rootScope, $q, config) {
		var api = 'http://localhost/wall.barcamp.hk/server/api.php',
			serverState = null,
			user = null;

			function setUser(data) {
				user = data;

				// Send out an event to the rootscope with the user
				if(user === null) {
					$rootScope.$emit('wall.logout', user);
				} else {
					$rootScope.$emit('wall.login', user);
				}
			}

		return {
			/**
			 * Initialize OAuth
			 */
			init: function() {
				// Initialize oAuth
				OAuth.initialize('dptmdeRHa1H18PwexEmhVUcP4OU');
			},

			/**
			 * Check if a user is already authenticated
			 *
			 * @return promise
			 */
			check: function() {
				var deferred = $q.defer();

				// Check on the server if the user is logged in
				$http({
					method: 'POST',
					url: config.api,
					data: {
						ajax: true,
						action: 'check'
					}
				}).success(function(data) {
					if(data !== 'false') setUser(data);

					deferred.resolve(data);
				})

				return deferred.promise;
			},

			/**
			 * Get the OAuth state from the server
			 *
			 * @return promise
			 */
			getServerState: function() {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: config.api,
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

			/**
			 * Perform a login on the server via OAuth
			 *
			 * @param {String} Service (Either Facebook or Twitter)
			 *
			 * @return promise
			 */
			login: function(service) {
				var deferred = $q.defer();

				OAuth.popup(service, {
					state: serverState
				}, function(error, result) {
					if(error) {
						deferred.reject(error);
					} else {
						$http({
							method: 'POST',
							url: config.api,
							data: {
								ajax: true,
								action: 'login',
								service: service,
								service_code: result.code
							}
						}).success(function(data) {
							deferred.resolve(data);

							setUser(data);
						});
					}
				});

				return deferred.promise;
			},

			/**
			 * Perform a login on the server via OAuth
			 *
			 * @return promise
			 */
			logout: function() {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: config.api,
					data: {
						ajax: true,
						action: 'logout'
					}
				}).success(function(data) {
					deferred.resolve(data);

					setUser(null);
				})

				return deferred.promise;
			}
		};
	}]);
})(window, window.angular);