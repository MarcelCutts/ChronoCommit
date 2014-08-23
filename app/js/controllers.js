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
							template: 'partials/countryPopup.html',
							className: 'ngdialog-theme-default',
							closeByEscape: true,
							closeByDocument: true,
							controller: 'dataMapsCtrl',
							scope: $scope
						});

						// gets the actual commit data for the country
						var countryPromise = timeDataService.getCountryData($scope.selectedCountry);
						countryPromise.then(function(data) {
							$scope.country = data;

							// adds the attribute for a full country name into the countrydata
							$scope.country.current_country = utilities.getCountryNameFromAbbreviation($scope.selectedCountry);
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
		.controller('sliderCtrl', ['$scope', 'timeDataService', 'autoplayService', 'utilities',
			function($scope, timeDataService, autoplayService, utilities) {
				// Controls the slider.

				$scope.sliderPosition = 0; // Starting position.

				$scope.toggleAutoplay = function(){
					autoplayService.toggleAutoplay();
				};

				// Register this method with the autoplay service so it will update as required.
				autoplayService.registerObserverCallback(function(autoplayState){
					if (autoplayState === true){
						$scope.sliderIconPath = "img/pause.png";
					}
					else {
						$scope.sliderIconPath = "img/play.png";
					}
				});

				// Start the autoplay to begin with.
				autoplayService.setAutoplayState(true);

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

				// Set of states for the overview's top right control
				$scope.visible = true;
				var minimizeIconPath = 'img/minimize.png';
				var minimizeIconCssClass = "minimize-icon";
				var maximizeIconPath = 'img/maximize.png';
				var maximiseIconCssClass = "maximise-icon";

				// Set of current states and the function
				// that toggles the states between the minimised
				// and maximised overview control
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