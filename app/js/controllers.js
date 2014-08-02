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
				$scope.slideValue = 0;
			}
		]);
})();