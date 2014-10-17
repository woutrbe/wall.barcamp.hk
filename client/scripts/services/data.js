(function() {
	var app = angular.module('wall.dataService', []);
	app.factory('dataService', ['$http', '$q', function($http, $q) {
		var links = [],
			jobs = [],
			deferredMenuStarted = false,
			deferredMenu = $q.defer();

		return {
			getMenu: function() {
				if(links.length > 0) {
					deferredMenu.resolve(links);
				} else {
					if(!deferredMenuStarted) {
						$http({
							method: 'POST',
							url: '../server/api.php',
							data: {
								ajax: true,
								action: 'getCats'
							}
						}).success(function(data, status, headers, config) {
							links = data;

							deferredMenu.resolve(data);
						})
					}

					deferredMenuStarted = true;
				}

				return deferredMenu.promise;
			},
			getJobs: function(page) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: '../server/api.php',
					data: {
						ajax: true,
						action: 'getJobs',
						page: page
					}
				}).success(function(data) {
					jobs = data;

					deferred.resolve(data);
				})

				return deferred.promise;
			},
			getJob: function(link) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: '../server/api.php',
					data: {
						ajax: true,
						action: 'getJob',
						link: link
					}
				}).success(function(data) {
					deferred.resolve(data);
				})

				return deferred.promise;
			},
			saveJob: function(content, catID) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: '../server/api.php',
					data: {
						ajax: true,
						action: 'saveJob',
						content: content,
						catID: catID
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(data) {
					deferred.resolve(data);
				})

				return deferred.promise;
			}
		}
	}])
})();