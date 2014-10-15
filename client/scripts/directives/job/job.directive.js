(function() {
	// Job directive
	var app = angular.module('wall.jobModule', ['monospaced.elastic', 'wall.dataService']);
	app.directive('job', ['$sce', 'dataService', function($sce, dataService) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/directives/job/job.html',
			scope: {
				job: '='
			},
			link: function(scope, element, attrs, ctrl) {
				// Add the element to the masonry grid
				ctrl.addToMasonry(element);

				// Remove the element from the masonry grid
				element.on('$destroy', function() {
					ctrl.removeFromMasonry(element);
				})
			},
			controller: 'JobController',
			controllerAs: 'jobCtrl'
		}
	}])
})();