(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService', 'ngDialog',
			function($scope, timeDataService, ngDialog) {

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

				$scope.countryClick = '';
				$scope.$watch('countryClick', function(newValue, oldValue) {
					debugger;
					if (newValue) {
						ngDialog.open({
							template: 'js/countryPopup.html'
						});
					}
				}, true);

				$scope.randomValue = 5;


			}
		])
		.controller('sliderCtrl', ['$scope', 'timeDataService',
			function($scope, timeDataService) {
				$scope.sliderPosition = 1; // Starting position

				$scope.$watch('sliderPosition', function(newValue, oldValue) {
					if (newValue) {
						$scope.sliderDate = timeDataService.updateDayAndHour(newValue);
						$scope.sliderTimeDescription = timeDataService.getTimeDescription();
					}
				}, true);
			}
		])
		.controller('popupCtrl', ['$scope', 'ngDialog',
			function($scope, ngDialog) {
				$scope.open = function() {
					ngDialog.open({
						template: 'js/countryPopup.html'
					});
				};
			}
		]);
})();