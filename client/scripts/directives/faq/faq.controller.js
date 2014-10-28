(function(window, angular, undefined) {
	var app = angular.module('wall.faq');
	app.controller('FAQController', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.showFaq = function() {
			$scope.faqActive = true;
			$scope.orgActive = false;
		}
		$scope.hideFaq = function() {
			if($scope.orgActive) {
				$scope.orgActive = false;
			} else {
				$scope.faqActive = false;
				$scope.orgActive = false;
			}
		}
		$scope.showOrg = function() {
			$scope.orgActive = true;
		}

		return $scope;
	}]);
})(window, window.angular);