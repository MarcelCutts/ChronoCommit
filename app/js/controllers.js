(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'timeDataService', 'utilities', 'ngDialog',
			function($scope, timeDataService, utilities, ngDialog) {
				// Watching service values, but may replace with broadcast
				// and catching that emission with $scope.$on. We'll see.
				//
				// Update the map data when the hour changes.
				$scope.$watch(function() {
					return timeDataService.dayHour();
				}, function(newVal, oldVal) {
					if (!utilities.isUndefinedOrNull(newVal)) {
						$scope.currentHour = newVal;
						var countriesPromise = timeDataService.getMapData();
						var countriesData = countriesPromise.then(function(data) {
							$scope.countriesData = data;
						});
					}
				}, true);

				// when a country is clicked, the clickevent will update selectedCountry
				// with the ID of the currently selected country
				// use this ID to launch popup with appropriate country data
				$scope.selectedCountry = '';
				var selectedCountry = '';
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
						selectedCountry = $scope.selectedCountry;
					}
				}, true);

				// reset the selected country to an empty string when the dialog is closed
				// unless you do this, the popup will not get triggered when you click on the same country twice
				$scope.$on('ngDialog.closed', function(e, $dialog) {
					$scope.selectedCountry = '';
				});
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
				var minimizeIconPath = 'img/minimize.png';
				var minimizeIconCssClass = "minimize-icon";
				var maximizeIconPath = 'img/maximize.png';
				var maximiseIconCssClass = "maximise-icon";

				$scope.iconPath = minimizeIconPath;
				$scope.iconCss = minimizeIconCssClass;
				$scope.toggleDescriptionVisibility = function() {
					$scope.visible = !$scope.visible;
					if ($scope.iconPath === minimizeIconPath) {
						$scope.iconPath = maximizeIconPath;
						$scope.iconCss = maximiseIconCssClass;
					} else {
						$scope.iconPath = minimizeIconPath;
						$scope.iconCss = minimizeIconCssClass;
					}
				};
			}
		]);
})();