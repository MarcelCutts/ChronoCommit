(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('MyCtrl1', ['$scope',
			function($scope) {

			}
		])
		.controller('dataMapsCtrl', ['$scope', 'countryDataService',
			function($scope, countryDataService) {

				$scope.countriesData = countryDataService.countriesData;

				$scope.colourGbr = function() {
					countryDataService.updateCountries()
				};
			}
		]);
})();