(function() {
	'use strict';

	/* Generic javascript functions that are useful
	   wrapped in an angular way for DI */
	angular.module('genericJsUtilities', [])
		.factory('utilities',
			function() {
				return {
					isUndefinedOrNull: function(val) {
						return angular.isUndefined(val) || val === null;
					}
				};
			});
})();