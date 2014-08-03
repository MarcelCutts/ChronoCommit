(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService',
			function($scope, timeDataService) {

				timeDataService.getMapData()
					.then(function(data) {
						$scope.countriesData = data;
					});
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

				$scope.$watch('timeAxisPosition', function(newValue, oldValue) {
					if (newValue) {
						timeDataService.updateDayAndHour(newValue);
						timeDataService.getMapData()
							.then(function(data) {
								$scope.countriesData = data;
							});
					}
				}, true);
			}
		]);
})();