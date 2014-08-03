(function() {

	'use strict';

	/* Services */
	angular.module('chronoCommit.services', [])
		.service('countryDataService', function() {
			this.updateCountries = function() {
				this.countriesData.GBR = {
					fillKey: "estonia"
				};
			};
		})
	.service('timeDataService', [ '$http', 'colorService', function($http, colorService) {
		this.commitData = $http.get('assets/hourly_commits.json').error(function(data, status) { 
			console.log(status + ': ' + data) 
		}).success(function(data) { 
			colorService.setMaxValue(data)
		})

		this.getDataFor = function(day, hour) {
			return this.commitData.then(function(response) {
				return response.data.filter(function(datum) { return datum['day'] == day && datum['hour'] == hour })
			}).then(function(data) {
				return data.reduce(function(memo, item) { 
					memo[item.country] = { 
						'fillKey': colorService.colorIndex(item.country, item.commits), 
						'numberOfThings': item.commits 
					}; 
					return memo 
				}, {})
			})
		}
	}])
	.service('colorService', function() {
		this.maxValue = 0
		this.hue = 128

		this.setMaxValue = function(data) {
			this.maxValue = data.reduce(function(memo, item) {
				if(memo[item.country] === undefined || memo[item.country] < item.commits) { memo[item.country] = item.commits }
				return memo
			}, {})
		}

		this.getColorPalette = function(hue) {
			var colors = []
			for(var saturation = 0; saturation < 100; saturation++) {
				colors.push('hsl(' + hue + ', ' + saturation + '%, 50%)')
			}

			return colors
		},

		this.colorIndex = function(country, value) {
			return Math.floor(value / this.maxValue[country] * 100)
		}
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
