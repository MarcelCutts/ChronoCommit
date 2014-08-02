(function() {

	'use strict';

	/* Directives */

	angular.module('chronoCommit.directives', [])
		.directive('worldMap', function() {

			function link(scope, element, attrs) {
				element[0].style.position = 'relative';
				element[0].style.display = 'block';
				element[0].style.width = '100vw';
				element[0].style.height = '100vh';

				var testMap = new Datamap({
					element: element[0],
					fills: {
						defaultFill: "#34495E",
						authorHasTraveledTo: "#fa0fa0",
						estonia: "#4891D9"
					},
					projection: 'mercator',
					data: scope.countries
				});

			}

			return {
				restrict: ' E ',
				scope: {
					countries: ' = '
				},
				link: link
			};

		});
})();