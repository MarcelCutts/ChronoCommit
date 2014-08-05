(function() {
	'use strict';
	/* Controllers */
	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService', 'utilities',
			function($scope, timeDataService, utilities) {
				// Watching service values, but may replace with broadcast
				// and catching that emission with $scope.$on. We'll see.
				$scope.$watch(function() {
					return timeDataService.hour;
				}, function(newVal, oldVal) {
					if (!utilities.isUndefinedOrNull(newVal)) {
						var countriesPromise = timeDataService.getMapData();
						var countriesData = countriesPromise.then(function(data) {
							$scope.countriesData = data;
						});
					}
				}, true);
			}
		])
		.controller('sliderCtrl', ['$scope', 'timeDataService', 'utilities',
			function($scope, timeDataService, utilities) {
				$scope.sliderPosition = 1; // Starting position

				$scope.$watch('sliderPosition', function(newValue, oldValue) {
					if (!utilities.isUndefinedOrNull(newValue)) {
						$scope.sliderDate = timeDataService.updateDayAndHour(newValue);
						$scope.sliderTimeDescription = timeDataService.getTimeDescription();
					}
				}, true);
			}
		])
		.controller('overviewCtrl', ['$scope',
			function($scope) {
				$scope.visible = true;

				$scope.toggle = function() {
					$scope.visible = !$scope.visible;
				};
			}
		]);
})();