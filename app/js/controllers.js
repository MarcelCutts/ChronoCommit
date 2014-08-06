(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService', 'utilities', 'ngDialog',
			function($scope, timeDataService, utilities, ngDialog) {
				// Watching service values, but may replace with broadcast
				// and catching that emission with $scope.$on. We'll see.
				$scope.$watch(function() {
					return timeDataService.hour;
				}, function(newVal, oldVal) {
					if (!utilities.isUndefinedOrNull(newVal)) {
						var countriesPromise = timeDataService.getMapData();
						$scope.currentHour = newVal;
						var countriesData = countriesPromise.then(function(data) {
							$scope.countriesData = data;
						});
					}
				}, true);

				// when a country is clicked, the clickevent will update selectedCountry
				// with the ID of the currently selected country
				// use this ID to launch popup with appropriate country data
				$scope.selectedCountry = '';
				$scope.$watch('selectedCountry', function(newValue, oldValue) {
					if (newValue) {
						ngDialog.open({
							template: 'js/countryPopup.html',
							className: 'ngdialog-theme-default',
							closeByEscape: true,
							closeByDocument: true,
							controller: 'dataMapsCtrl',
							scope: $scope
						});

						var countryPromise = timeDataService.getCountryData($scope.selectedCountry);
						countryPromise.then(function(data) {
							$scope.country = data;
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