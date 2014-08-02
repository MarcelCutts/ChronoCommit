(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('dataMapsCtrl', ['$scope', 'countryDataService',
			function($scope, countryDataService) {

				$scope.countriesData = countryDataService.countriesData;

				$scope.colourGbr = function() {
					countryDataService.updateCountries();
				};
			}
		])
		.controller('sliderCtrl', ['$scope', 'countryDataService',
			function($scope, countryDataService) {
				$scope.timeAxisPosition = 7;

				$scope.$watch('timeAxisPosition', function(newValue, oldValue) {
					if (newValue)
						console.log('clipclop' + newValue);
				}, true);
			}
		]);
})();