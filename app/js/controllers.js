(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService',
			function($scope, timeDataService) {

				// Watching service values, but may replace with broadcast
				// and catching that emission with $scope.$on. We'll see.
				$scope.$watch(function() {
					return timeDataService.hour;
				}, function(newVal, oldVal) {
					if (newVal) {
						var countriesPromise = timeDataService.getMapData();
						var countriesData = countriesPromise.then(function(data) {
							$scope.countriesData = data;
						});
					}
				}, true);
			}
		])
		.controller('sliderCtrl', ['$scope', 'timeDataService',
			function($scope, timeDataService) {
				$scope.sliderPosition = 40; // Starting position

				$scope.$watch('sliderPosition', function(newValue, oldValue) {
					if (newValue) {
						$scope.sliderDate = timeDataService.updateDayAndHour(newValue);
						$scope.sliderTimeDescription = timeDataService.getTimeDescription();
					}
				}, true);
			}
		]);
})();