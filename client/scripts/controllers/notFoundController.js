(function() {
	var app = angular.module('wall.notFound', []);

	app.controller('NotFoundController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.job = {
			catID: 0,
			content: 'Blah blah not found',
			timestamp: new Date().getTime(),
			link: '',
			toolbar: false,
			cat: {
				safeLink: "admin-notice",
				link: "Admin Notice"
			}
		}
	}])
})();