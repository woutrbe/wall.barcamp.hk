(function() {
	var app = angular.module('wall.dataService', []);
	app.factory('dataService', ['$http', '$q', function($http, $q) {
		var api = 'http://localhost/wall.barcamp.hk/server/api.php',
			links = [],
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
							url: api,
							data: {
								ajax: true,
								action: 'getCats'
							}
						}).success(function(data, status, headers, config) {
							links = data;

							_.each(links, function(link) {
								link.safeLink = link.link.toLowerCase().replace(/ /g, '-');
							})

							// Add the "view all" link
							links.unshift({
								color: '242, 90, 149',
								id: '0',
								link: 'View all',
								safeLink: 'all',
								hideFromEditable: true
							})

							deferredMenu.resolve(links);
						})
					}

					deferredMenuStarted = true;
				}

				return deferredMenu.promise;
			},
			getJobs: function(page, cat) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: api,
					data: {
						ajax: true,
						action: 'getJobs',
						page: page,
						cat: cat
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
					url: api,
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
					url: api,
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
			},
			removeJob: function(job) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: api,
					data: {
						ajax: true,
						action: 'deleteJob',
						jobID: job.jobID
					}
				}).success(function(data) {
					deferred.resolve(data);
				})

				return deferred.promise;
			},
			flagJob: function(job) {
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: api,
					data: {
						ajax: true,
						action: 'flagJob',
						jobID: job.jobID
					}
				}).success(function(data) {
					deferred.resolve(data);
				})

				return deferred.promise;
			}
		}
	}])
})();