(function() {

	'use strict';

	/* Services */
	angular.module('chronoCommit.services', [])
		.service('timeDataService', ['$http', '$q', 'colorService', 'utilities',
			function($http, $q, colorService, utilities) {
				this.day = 2;
				this.hour = 17;

				// Returns the number of hours since Sunday at 00:00.
				this.dayHour = function() {
					return this.hour + this.day * 24;
				};

				this.sliderScaleMax = 168;

				this.data = null;

				this.updateDayAndHour = function(sliderValue) {

					// length of the scale we are mapping from
					var scaleLength = this.sliderScaleMax;

					// length of each day
					var dayLength = scaleLength / 7;

					// length of each hour
					var hourLength = dayLength / 24;

					// first calculate the day
					this.day = Math.floor(sliderValue / dayLength);

					// now calculate the hour
					var dayReminder = sliderValue % dayLength;
					this.hour = Math.floor(dayReminder / hourLength);
				};

				this.getTimeDescription = function() {
					return utilities.dayHourToString(this.dayHour());
				};

				// Returns a promise that fetches the commit data
				// if it hasn't already been collected.
				this.mapDataPromise = function() {
					var that = this;

					var defer = $q.defer();
					if (this.data !== null) {
						defer.resolve(this.data);
					} else {
						$http.get('assets/hourly_commits.json').error(function(data, status) {
							var message = status + ': ' + data;
							console.log(message);
							defer.reject(message);
						}).success(function(data) {
							that.data = data;

							// First-time data collection functions
							colorService.setMaxValue(data);
							
							that.allCountries = data
								.map(function(item) { return item.country; })
								.filter(function(value, index, self) { return self.indexOf(value) === index; }); // Only unique

							defer.resolve(data);
						});
					}

					return defer.promise;
				};

				this.getMapData = function() {
					var that = this;

					return this.mapDataPromise()
						.then(function(data) {
							return data.filter(function(datum) {
								return datum.day == that.day && datum.hour == that.hour;
							});
						}).then(function(data) {
							return that.allCountries.reduce(function(memo, country) {
								var datum = data.filter(function(d) { return d.country == country; });
								if(datum.length != 1) { datum = {country: country, commits: 0}; }
								else { datum = datum[0]; }

								memo[datum.country] = {
									'fillKey': colorService.colorIndex(datum.country, datum.commits),
									'numberOfThings': datum.commits
								};
								return memo;
							}, {});
						});
				};

				this.allCountries = [];

				// Returns all the data for a particular country.
				// Data will not be ordered!
				// A promise is returned. Use promise.then(function(data) { ... }) to get the data.
				this.getCountryData = function(country_code) {
					return this.mapDataPromise()
						.then(function(data) {
							return data.filter(function(datum) {
								return datum.country == country_code;
							});
						});
				};
			}
		])
		.service('colorService', function() {
			this.maxValue = 0;
			this.hue = 128;

			this.setMaxValue = function(data) {
				this.maxValue = data.reduce(function(memo, item) {
					if (memo[item.country] === undefined || memo[item.country] < item.commits) {
						memo[item.country] = item.commits;
					}

					return memo;
				}, {});
			};

			this.getColorPalette = function(hue) {
				var colors = [];
				for (var saturation = 0; saturation < 100; saturation++) {
					colors.push('hsl(' + hue + ', ' + saturation + '%, 50%)');
				}

				return colors;
			};

			this.colorIndex = function(country, value) {
				var index = Math.floor(value / this.maxValue[country] * 100) - 1;
				return index < 0 ? 0 : index;
			};
		})
		.service('autoplayService', function(){
			// Set this to false as a default.
			var autoplayState = false;
			var observerCallbacks = [];

			// Register an observer callback
			this.registerObserverCallback = function(callback){
				observerCallbacks.push(callback);

				// Execute the callback - if it is registered after a state change on initialisation,
				// the callback won't have initially been called in the part of the app that is registering it.
				// Execute it to ensure the state is up to date in that part of the application.
				callback(autoplayState);
			};

			// Called when autoplay state updated
			var notifyObservers = function(){
				angular.forEach(observerCallbacks, function(callback){
					callback(autoplayState);
				});
			};

			this.setAutoplayState = function (state) {
				autoplayState = state;
				notifyObservers();
			};

			this.toggleAutoplay = function () {
				if (autoplayState === true) {
					autoplayState = false;
				}
				else {
					autoplayState = true;
				}

				notifyObservers();
			};
		});
})();
