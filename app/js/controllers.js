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
				$scope.timeAxisPosition = 7;

				$scope.$watch('timeAxisPosition', function(newValue, oldValue) {
					if (newValue)
						timeDataService.updateDayAndHour(newValue);
					timeDataService.getMapData()
						.then(function(data) {
							$scope.countriesData = data;
							$scope.testMap.updateChoropleth(data);
						});
				}, true);
			}
		]);
})();