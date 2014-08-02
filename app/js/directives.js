(function() {

	'use strict';

	/* Directives */

	/**
	 * This directive exists to hold the large world map
	 * visualisation. This creates its own containing div
	 * and fills itself using the DataMap library.
	 *
	 * Additionally some scope watching occurs, and a
	 * redraw happens if the data service changes.
	 */
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

				/**
				 * Watch the countries value (data bound to
				 * the controller) and if it does, update the
				 * map drawing.
				 * @param  {} newValue - Value the object changed to
				 * @param  {} oldValue - Value the object changed from
				 */
				scope.$watch('countries', function(newValue, oldValue) {
					if (newValue)
						testMap.updateChoropleth(newValue);
				}, true);
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