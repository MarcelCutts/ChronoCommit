(function() {

	'use strict';

	/* Services */
	angular.module('chronoCommit.services', [])
		.service('countryDataService', function() {
			this.countriesData = {
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
				}
			};

			this.updateCountries = function() {
				this.countriesData.GBR = {
					fillKey: "estonia"
				};
			};
		})
	.service('timeDataService', function($http) {
		this.commitData = $http.jsonp('/assets/hourly_commits.json')

		this.getDataFor = function(day, hour) {
			return this.commitData.filter(function(datum) { datum['day'] == day && datum['hour'] == hour })
		}
	});
})();
