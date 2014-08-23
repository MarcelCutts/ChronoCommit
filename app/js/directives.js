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
		.directive('worldMap', ['colorService', 'utilities',
			function(colorService, utilities) {
				function link(scope, element, attrs) {
					// Values stored so that the background can be restored after resizing.
					var gradient, backgrounds, currentHour, previousHour;

					// Set defaults for the hour
					currentHour = 0;
					previousHour = 0;

					element[0].style.position = 'absolute';
					element[0].style.display = 'block';
					element[0].style.width = '100%';
					element[0].style.height = '100%';

					var palette = colorService.getColorPalette(339);
					palette.defaultFill = palette[0];

					var worldMap = new Datamap({
						element: element[0],
						fills: palette,
						projection: 'mercator',
						redrawOnResize: true,
						data: {},
						geographyConfig: {
							popupTemplate: function(geo, data) {
								var hoverinfo = ['<div class="hoverinfo"><strong>' + geo.properties.name + '</strong><br/>'];
								if (data === null) {
									data = {
										numberOfThings: 0
									};
								}

								hoverinfo.push(data.numberOfThings + ' commit');
								if (data.numberOfThings != 1) {
									hoverinfo.push('s');
								} // Pluralicious

								hoverinfo.push('</div>');
								return hoverinfo.join('');

							}
						}
					});

					var backgroundClass = "sunlight-background";

					// Define the linear gradient used for the background in here.
					function addGradient() {
						var gradient = worldMap.svg.append("defs")
							.append("linearGradient")
							.attr("id", "sun")
							.attr("x1", "0%")
							.attr("y1", "0%")
							.attr("x2", "100%")
							.attr("y2", "0%")
							.attr("spreadMethod", "pad");

						// Star of sunset
						gradient.append("svg:stop")
							.attr("offset", "0%")
							.attr("stop-color", "hsl(202, 100%, 30%)")
							.attr("stop-opacity", 1);

						// End of sunset
						gradient.append("svg:stop")
							.attr("offset", "8%")
							.attr("stop-color", "hsl(202, 100%, 20%)")
							.attr("stop-opacity", 1);

						// Start of sunrise
						gradient.append("svg:stop")
							.attr("offset", "42%")
							.attr("stop-color", "hsl(202, 100%, 20%)")
							.attr("stop-opacity", 1);

						// End of sunrise
						gradient.append("svg:stop")
							.attr("offset", "50%")
							.attr("stop-color", "hsl(202, 100%, 30%)")
							.attr("stop-opacity", 1);

						return gradient;
					}

					// Takes on a D3 selection, and returns the width of the corresponding SVG element.
					function getWidthOfElementFromD3Selection(selection) {
						return selection[0][0].getBBox().width;
					}

					// Updates the backgrounds based on the current time.
					// This assumes that the change between hours is continuous.
					function updateBackgrounds(hour, previousHour, bgrounds) {
						if (!utilities.isUndefinedOrNull(hour)) {
							// Translate all of the things.
							// Current location is left, right or center
							angular.forEach(bgrounds, function(background, currentLocation) {
								var width = background.imageWidth;
								var widthPerHour = width / 24;

								// Initial offset to line it up correctly.
								var xOffset = -(hour) * widthPerHour;

								background
									.transition(250)
									.ease('linear')
									.attr("transform", "translate(" + xOffset + ",0)");
							});
						}
					}

					// Collect the items used as the background image.
					// Adds the background image to SVG, and returns the D3 selection
					function addBackgrounds() {

						// We draw 8 backgrounds; one for each day of the week, plus one for overlap
						var width = null;
						var backgrounds = [];
						for (var bgId = 0; bgId < 8; bgId++) {
							var background = worldMap.svg.insert("rect", "g")
								.attr("class", backgroundClass)
								.attr("width", "100%")
								.attr("height", "100%")
								.attr("fill", "url(#sun)");

							if (width === null) {
								width = getWidthOfElementFromD3Selection(background);
							}

							// Keep track of the width that the box is covering when at 100%.
							// This value should be used to calculate translations.
							background.imageWidth = width;

							// Add a small amount of overlap on the svg images.
							background.attr("width", (1.02 * width) + "px");

							background.attr("x", width * bgId);
							backgrounds[bgId] = background;
						}

						return backgrounds;
					}

					// Deals with resizing
					// The map will redraw, overwriting the existing SVG.
					// Will first need the linear gradient. Then add backgrounds. Finally update the position of the backgrounds.
					function drawBackground() {
						gradient = addGradient();
						backgrounds = addBackgrounds();
						updateBackgrounds(currentHour, previousHour, backgrounds);
					}

					function drawDateline() {
						worldMap.svg.insert("line", "g")
							.attr("class", "dateline")
							.attr("x1", "16%")
							.attr("y1", "0%")
							.attr("x2", "16%")
							.attr("y2", "100%");
					}

					// Initialise the background.
					drawBackground();
					drawDateline();

					// Register the onresize function. Ensure we don't override any existing onresize functionality.
					if (window.onresize !== null) {
						var existingOnResize = window.onresize;

						window.onresize = function() {
							existingOnResize();
							drawBackground();
							drawDateline();
						};
					} else {
						window.onresize = function() {
							drawBackground();
							drawDateline();
						};
					}

					/**
					 * Watch the countries value (data bound to
					 * the controller) and if it does, update the
					 * map drawing.
					 * @param  {} newValue - Value the object changed to
					 * @param  {} oldValue - Value the object changed from
					 */
					scope.$watchCollection('countries', function(newValue, oldValue) {
						if (!utilities.isUndefinedOrNull(newValue)) {
							worldMap.updateChoropleth(newValue);
						}
					});

					/**
					 * Watch the currentHour value (data bound to
					 * the controller) and if it does, update the
					 * background of the map.
					 * @param  {} newValue - Value the object changed to
					 * @param  {} oldValue - Value the object changed from
					 */
					scope.$watch('currentHour', function(newValue, oldValue) {
						if (!utilities.isUndefinedOrNull(newValue)) {
							// Move the static SVG images.
							// There is a duplicate image off canvas to the left to simulate scrolling.
							updateBackgrounds(newValue, oldValue, backgrounds);

							// Set these values so that they can be referenced if the page is resized.
							currentHour = newValue;
							previousHour = oldValue;
						}
					});
				}

				return {
					restrict: ' E ',
					scope: {
						countries: ' = ',
						currentHour: ' = '
					},
					link: link
				};
			}
		])
		.directive('timeSlider', ['autoplayService', 'utilities',
			function(autoplayService, utilities) {

				function link(scope, element, attrs) {
					var margin = {
							top: 0,
							right: 10,
							bottom: 0,
							left: 10
						},
						width = 500 - margin.left - margin.right,
						height = 40 - margin.bottom - margin.top;

					var xMax = 167;
					var x = d3.scale.linear()
						.domain([0, xMax])
						.range([0, width])
						.clamp(true);

					var brush = d3.svg.brush()
						.x(x)
						.extent([0, 0])
						.on("brush", brushed);

					var svg = d3.select(element[0]).append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height / 2 + ")")
						.call(d3.svg.axis()
							.scale(x)
							.orient("bottom")
							.tickFormat(function(d, i) {
								var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
								return days[i];
							})
							.tickValues([0, 24, 48, 72, 96, 120, 144])
							.tickSize(0)
							.tickPadding(12))
						.select(".domain")
						.select(function() {
							return this.parentNode.appendChild(this.cloneNode(true));
						})
						.attr("class", "halo");

					var slider = svg.append("g")
						.attr("class", "slider")
						.call(brush);

					slider.selectAll(".extent,.resize")
						.remove();

					slider.select(".background")
						.attr("height", height);

					var handle = slider.append("circle")
						.attr("class", "handle")
						.attr("transform", "translate(0," + height / 2 + ")")
						.attr("r", 9);

					slider
						.call(brush.event)
						.transition() // gratuitous intro!
					.duration(750)
						.call(brush.extent([scope.sliderPosition, scope.sliderPosition]))
						.call(brush.event);

					// Move the slider to the next value
					function autonext() {
						var value = scope.sliderPosition;

						var newValue = value + 1;
						if (newValue > xMax) {
							newValue = 0;
						}

						scope.$apply(function() {
							scope.sliderPosition = newValue;
						});

						// Animate slider
						slider
							.call(brush.event)
							.transition()
							.duration(250)
							.ease("linear")
							.call(brush.extent([scope.sliderPosition, scope.sliderPosition]))
							.call(brush.event);
					}

					var autonextHook;

					function brushed() {
						var value = brush.extent()[0];

						if (d3.event.sourceEvent) { // not a programmatic event
							// As soon as we get a mouse event, kill autonext()
							autoplayService.setAutoplayState(false);

							value = x.invert(d3.mouse(this)[0]);
							scope.$apply(function() {
								scope.sliderPosition = value;
							});
							brush.extent([value, value]);
						}

						handle.attr("cx", x(value));
					}

					// Watch the autoplay value. If this changes, toggle autoplay as the value dictates.
					autoplayService.registerObserverCallback(function(autoplayState) {
						if (autoplayState === true) {
							autonextHook = setInterval(autonext, 250);
						} else {
							clearInterval(autonextHook);
						}
					});
				}

				return {
					restrict: ' E ',
					scope: {
						sliderPosition: ' = '
					},
					link: link
				};

			}
		])
		.directive('projectOverview', function() {
			return {
				restrict: 'E',
				templateUrl: 'partials/project-overview.html'
			};
		})
		.directive('projectDescription', function() {
			return {
				restrict: 'E',
				templateUrl: 'partials/project-description.html'
			};
		});
})();
