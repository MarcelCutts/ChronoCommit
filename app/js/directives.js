(function() {

	'use strict';

	/* Directives */

	angular.module('chronoCommit.directives', [])
		.directive('worldMap', function() {

			function link(scope, element, attrs) {
				element[0].style.position = 'relative';
				element[0].style.display = 'block';
				element[0].style.width = '100%';
				element[0].style.height = '100vh';

				var testMap = new Datamap({
					element: element[0],
					fills: {
						defaultFill: "#ABDDA4",
						authorHasTraveledTo: "#fa0fa0"
					},
					data: {
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
					}
				});

			}

			return {
				restrict: ' E ',
				link: link,
				scope: {
					data: ' & '
				}
			};

		});
})();