(function() {
	'use strict';
	/* Controllers */
	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService', 'utilities',
			// Controls the world map.

			function($scope, timeDataService, utilities) {
				// Watching service values, but may replace with broadcast
				// and catching that emission with $scope.$on. We'll see.
				//
				// Update the map data when the hour changes.
				$scope.$watch(function() {
					return timeDataService.hour;
				}, function(newVal, oldVal) {
					if (!utilities.isUndefinedOrNull(newVal)) {
            			$scope.currentHour = newVal;

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
				// Controls the slider.

				$scope.sliderPosition = 0; // Starting position

				// When the slider position changes, update the date and time description.
				$scope.$watch('sliderPosition', function(newValue, oldValue) {
					if (!utilities.isUndefinedOrNull(newValue)) {
						$scope.sliderDate = timeDataService.updateDayAndHour(newValue);
						$scope.sliderTimeDescription = timeDataService.getTimeDescription();
					}
				}, true);
			}
		])
		.controller('overviewCtrl', ['$scope',
			// Controls the introductory overview shown above the map.
			// The view is available in project-overview.html

			function($scope) {
				$scope.visible = true;

				$scope.toggle = function() {
					$scope.visible = !$scope.visible;
				};
			}
		]);
})();