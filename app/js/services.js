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
		});
})();

// input: slider value as float in range [0, 168]
// output: string in the form "Day hour", e.g. "Tue 8" meaning submission was on Tuesday between 08:00-08:59
function getDayTime(sliderValue){
	var sliderScaleMin = 0;
	var sliderScaleMax = 168;
	
	var dayTime = "";

	// length of the scale we are mapping from
	var scaleLength = sliderScaleMax - sliderScaleMin;
		
	// days of the week array
	var daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	
	// length of each day
	var dayLength = scaleLength/7;
	
	// length of each hour
	var hourLength = dayLength/24;
	
	// first calculate the day
	var dayDivision = Math.floor(sliderValue/dayLength);
	var dayReminder = sliderValue % dayLength;
	// add the day to return value
	dayTime += daysOfTheWeek[dayDivision];
	
	// now calculate the hour
	var hourDivision = Math.floor(dayReminder/hourLength);
	// add the day to return value
	dayTime += " " + hourDivision;
	
	return dayTime;
}