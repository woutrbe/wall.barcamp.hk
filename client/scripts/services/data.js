(function() {
	var app = angular.module('dataService', []);
	app.service('dataService', ['$http', '$q', function($http, $q) {
		var links = [];

		return {
			getMenu: function() {
				var deferred = $q.defer();

				if(links.length > 0) {
					deferred.resolve(links);
				} else {
					$http.get('http://localhost/wall.barcamp.hk/server/api.php?ajax=true&action=getCats').success(function(data) {
						deferred.resolve(data);
					})
				}

				return deferred.promise;
			}
		}
	}])
})();