(function() {
	'use strict';

	// Declare app level module which depends on filters, and services
	angular.module('chronoCommit', [
		'chronoCommit.filters',
		'chronoCommit.services',
		'chronoCommit.directives',
		'chronoCommit.controllers',
		'ngDialog',
		'genericJsUtilities',
		'duScroll'
	]).value('duScrollEasing', function(t) {
		return t * t * t;
	});
})();