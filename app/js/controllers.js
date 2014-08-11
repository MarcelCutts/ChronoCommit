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