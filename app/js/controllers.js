(function() {
	'use strict';
	/* Controllers */

	angular.module('chronoCommit.controllers', [])
		.controller('MyCtrl1', ['$scope',
			function($scope) {

			}
		])
		.controller('dataMapsCtrl', ['$scope',
			function($scope) {
				$scope.countries = {
					USA: {
						fillKey: "authorHasTraveledTo"
					},
					JPN: {
						fillKey: "authorHasTraveledTo"
					},
					ITA: {
						fillKey: "authorHasTraveledTo"
					},
					CRI: {
						fillKey: "authorHasTraveledTo"
					},
					KOR: {
						fillKey: "authorHasTraveledTo"
					},
					DEU: {
						fillKey: "authorHasTraveledTo"
					},
					EST: {
						fillKey: "estonia"
					},
				};
			}
		]);
})();