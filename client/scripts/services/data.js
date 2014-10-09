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
						$http.get('../server/api.php?ajax=true&action=getCats').success(function(data) {
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

				$http.get('../server/api.php?ajax=true&action=getJobs&page=' + page).success(function(data) {
					jobs = data;

					deferred.resolve(data);
				})

				return deferred.promise;
			}
		}
	}])
})();