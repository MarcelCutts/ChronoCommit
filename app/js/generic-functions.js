(function() {
	'use strict';

	/* Generic angular functions */
	angular.module('chronoCommit.genericFunctions', [])
      .config(function(){
        // Add generic angular functions here.
        angular.isUndefinedOrNull = function(val) {
          return angular.isUndefined(val) || val === null;
        };
      });
})();