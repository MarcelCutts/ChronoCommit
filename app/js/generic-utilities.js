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
					},
					dayHourToString: function(dayHour) {
						var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
						var hour = dayHour % 24;
						var day = Math.floor(dayHour / 24);
						var display_hour = hour < 10 ? "0" + hour : hour;
						return days[day] + ", " + display_hour + ":00 (PDT)";
					},
					getCountryNameFromAbbreviation: function(val) {

						var countryLookupTable = {
							"AFG": function() {
								return "Afghanistan";
							},
							"ALA": function() {
								return "Åland Islands";
							},
							"ALB": function() {
								return "Albania";
							},
							"DZA": function() {
								return "Algeria";
							},
							"ASM": function() {
								return "American Samoa";
							},
							"AND": function() {
								return "Andorra";
							},
							"AGO": function() {
								return "Angola";
							},
							"AIA": function() {
								return "Anguilla";
							},
							"ATA": function() {
								return "Antarctica";
							},
							"ATG": function() {
								return "Antigua and Barbuda";
							},
							"ARG": function() {
								return "Argentina";
							},
							"ARM": function() {
								return "Armenia";
							},
							"ABW": function() {
								return "Aruba";
							},
							"AUS": function() {
								return "Australia";
							},
							"AUT": function() {
								return "Austria";
							},
							"AZE": function() {
								return "Azerbaijan";
							},
							"BHS": function() {
								return "Bahamas";
							},
							"BHR": function() {
								return "Bahrain";
							},
							"BGD": function() {
								return "Bangladesh";
							},
							"BRB": function() {
								return "Barbados";
							},
							"BLR": function() {
								return "Belarus";
							},
							"BEL": function() {
								return "Belgium";
							},
							"BLZ": function() {
								return "Belize";
							},
							"BEN": function() {
								return "Benin";
							},
							"BMU": function() {
								return "Bermuda";
							},
							"BTN": function() {
								return "Bhutan";
							},
							"BOL": function() {
								return "Bolivia";
							},
							"BES": function() {
								return "Bonaire, Sint Eustatius and Saba";
							},
							"BIH": function() {
								return "Bosnia and Herzegovina";
							},
							"BWA": function() {
								return "Botswana";
							},
							"BVT": function() {
								return "Bouvet Island";
							},
							"BRA": function() {
								return "Brazil";
							},
							"IOT": function() {
								return "British Indian Ocean Territory";
							},
							"BRN": function() {
								return "Brunei Darussalam";
							},
							"BGR": function() {
								return "Bulgaria";
							},
							"BFA": function() {
								return "Burkina Faso";
							},
							"BDI": function() {
								return "Burundi";
							},
							"KHM": function() {
								return "Cambodia";
							},
							"CMR": function() {
								return "Cameroon";
							},
							"CAN": function() {
								return "Canada";
							},
							"CPV": function() {
								return "Cabo Verde";
							},
							"CYM": function() {
								return "Cayman Islands";
							},
							"CAF": function() {
								return "Central African Republic";
							},
							"TCD": function() {
								return "Chad";
							},
							"CHL": function() {
								return "Chile";
							},
							"CHN": function() {
								return "China";
							},
							"CXR": function() {
								return "Christmas Island";
							},
							"CCK": function() {
								return "Cocos (Keeling) Islands";
							},
							"COL": function() {
								return "Colombia";
							},
							"COM": function() {
								return "Comoros";
							},
							"COG": function() {
								return "Congo";
							},
							"COD": function() {
								return "Congo";
							},
							"COK": function() {
								return "Cook Islands";
							},
							"CRI": function() {
								return "Costa Rica";
							},
							"CIV": function() {
								return "Côte d'Ivoire";
							},
							"HRV": function() {
								return "Croatia";
							},
							"CUB": function() {
								return "Cuba";
							},
							"CUW": function() {
								return "Curaçao";
							},
							"CYP": function() {
								return "Cyprus";
							},
							"CZE": function() {
								return "Czech Republic";
							},
							"DNK": function() {
								return "Denmark";
							},
							"DJI": function() {
								return "Djibouti";
							},
							"DMA": function() {
								return "Dominica";
							},
							"DOM": function() {
								return "Dominican Republic";
							},
							"ECU": function() {
								return "Ecuador";
							},
							"EGY": function() {
								return "Egypt";
							},
							"SLV": function() {
								return "El Salvador";
							},
							"GNQ": function() {
								return "Equatorial Guinea";
							},
							"ERI": function() {
								return "Eritrea";
							},
							"EST": function() {
								return "Estonia";
							},
							"ETH": function() {
								return "Ethiopia";
							},
							"FLK": function() {
								return "Falkland Islands (Malvinas)";
							},
							"FRO": function() {
								return "Faroe Islands";
							},
							"FJI": function() {
								return "Fiji";
							},
							"FIN": function() {
								return "Finland";
							},
							"FRA": function() {
								return "France";
							},
							"GUF": function() {
								return "French Guiana";
							},
							"PYF": function() {
								return "French Polynesia";
							},
							"ATF": function() {
								return "French Southern Territories";
							},
							"GAB": function() {
								return "Gabon";
							},
							"GMB": function() {
								return "Gambia";
							},
							"GEO": function() {
								return "Georgia";
							},
							"DEU": function() {
								return "Germany";
							},
							"GHA": function() {
								return "Ghana";
							},
							"GIB": function() {
								return "Gibraltar";
							},
							"GRC": function() {
								return "Greece";
							},
							"GRL": function() {
								return "Greenland";
							},
							"GRD": function() {
								return "Grenada";
							},
							"GLP": function() {
								return "Guadeloupe";
							},
							"GUM": function() {
								return "Guam";
							},
							"GTM": function() {
								return "Guatemala";
							},
							"GGY": function() {
								return "Guernsey";
							},
							"GIN": function() {
								return "Guinea";
							},
							"GNB": function() {
								return "Guinea-Bissau";
							},
							"GUY": function() {
								return "Guyana";
							},
							"HTI": function() {
								return "Haiti";
							},
							"HMD": function() {
								return "Heard Island and McDonald Islands";
							},
							"VAT": function() {
								return "Holy See (Vatican City State)";
							},
							"HND": function() {
								return "Honduras";
							},
							"HKG": function() {
								return "Hong Kong";
							},
							"HUN": function() {
								return "Hungary";
							},
							"ISL": function() {
								return "Iceland";
							},
							"IND": function() {
								return "India";
							},
							"IDN": function() {
								return "Indonesia";
							},
							"IRN": function() {
								return "Iran";
							},
							"IRQ": function() {
								return "Iraq";
							},
							"IRL": function() {
								return "Ireland";
							},
							"IMN": function() {
								return "Isle of Man";
							},
							"ISR": function() {
								return "Israel";
							},
							"ITA": function() {
								return "Italy";
							},
							"JAM": function() {
								return "Jamaica";
							},
							"JPN": function() {
								return "Japan";
							},
							"JEY": function() {
								return "Jersey";
							},
							"JOR": function() {
								return "Jordan";
							},
							"KAZ": function() {
								return "Kazakhstan";
							},
							"KEN": function() {
								return "Kenya";
							},
							"KIR": function() {
								return "Kiribati";
							},
							"PRK": function() {
								return "South Korea";
							},
							"KOR": function() {
								return "North Korea";
							},
							"KWT": function() {
								return "Kuwait";
							},
							"KGZ": function() {
								return "Kyrgyzstan";
							},
							"LAO": function() {
								return "Lao";
							},
							"LVA": function() {
								return "Latvia";
							},
							"LBN": function() {
								return "Lebanon";
							},
							"LSO": function() {
								return "Lesotho";
							},
							"LBR": function() {
								return "Liberia";
							},
							"LBY": function() {
								return "Libya";
							},
							"LIE": function() {
								return "Liechtenstein";
							},
							"LTU": function() {
								return "Lithuania";
							},
							"LUX": function() {
								return "Luxembourg";
							},
							"MAC": function() {
								return "Macao";
							},
							"MKD": function() {
								return "Macedonia";
							},
							"MDG": function() {
								return "Madagascar";
							},
							"MWI": function() {
								return "Malawi";
							},
							"MYS": function() {
								return "Malaysia";
							},
							"MDV": function() {
								return "Maldives";
							},
							"MLI": function() {
								return "Mali";
							},
							"MLT": function() {
								return "Malta";
							},
							"MHL": function() {
								return "Marshall Islands";
							},
							"MTQ": function() {
								return "Martinique";
							},
							"MRT": function() {
								return "Mauritania";
							},
							"MUS": function() {
								return "Mauritius";
							},
							"MYT": function() {
								return "Mayotte";
							},
							"MEX": function() {
								return "Mexico";
							},
							"FSM": function() {
								return "Micronesia";
							},
							"MDA": function() {
								return "Moldova";
							},
							"MCO": function() {
								return "Monaco";
							},
							"MNG": function() {
								return "Mongolia";
							},
							"MNE": function() {
								return "Montenegro";
							},
							"MSR": function() {
								return "Montserrat";
							},
							"MAR": function() {
								return "Morocco";
							},
							"MOZ": function() {
								return "Mozambique";
							},
							"MMR": function() {
								return "Myanmar";
							},
							"NAM": function() {
								return "Namibia";
							},
							"NRU": function() {
								return "Nauru";
							},
							"NPL": function() {
								return "Nepal";
							},
							"NLD": function() {
								return "Netherlands";
							},
							"NCL": function() {
								return "New Caledonia";
							},
							"NZL": function() {
								return "New Zealand";
							},
							"NIC": function() {
								return "Nicaragua";
							},
							"NER": function() {
								return "Niger";
							},
							"NGA": function() {
								return "Nigeria";
							},
							"NIU": function() {
								return "Niue";
							},
							"NFK": function() {
								return "Norfolk Island";
							},
							"MNP": function() {
								return "Northern Mariana Islands";
							},
							"NOR": function() {
								return "Norway";
							},
							"OMN": function() {
								return "Oman";
							},
							"PAK": function() {
								return "Pakistan";
							},
							"PLW": function() {
								return "Palau";
							},
							"PSE": function() {
								return "Palestine";
							},
							"PAN": function() {
								return "Panama";
							},
							"PNG": function() {
								return "Papua New Guinea";
							},
							"PRY": function() {
								return "Paraguay";
							},
							"PER": function() {
								return "Peru";
							},
							"PHL": function() {
								return "Philippines";
							},
							"PCN": function() {
								return "Pitcairn";
							},
							"POL": function() {
								return "Poland";
							},
							"PRT": function() {
								return "Portugal";
							},
							"PRI": function() {
								return "Puerto Rico";
							},
							"QAT": function() {
								return "Qatar";
							},
							"REU": function() {
								return "Réunion";
							},
							"ROU": function() {
								return "Romania";
							},
							"RUS": function() {
								return "Russia";
							},
							"RWA": function() {
								return "Rwanda";
							},
							"BLM": function() {
								return "Saint Barthélemy";
							},
							"SHN": function() {
								return "Saint Helena, Ascension and Tristan da Cunha";
							},
							"KNA": function() {
								return "Saint Kitts and Nevis";
							},
							"LCA": function() {
								return "Saint Lucia";
							},
							"MAF": function() {
								return "Saint Martin (French part)";
							},
							"SPM": function() {
								return "Saint Pierre and Miquelon";
							},
							"VCT": function() {
								return "Saint Vincent and the Grenadines";
							},
							"WSM": function() {
								return "Samoa";
							},
							"SMR": function() {
								return "San Marino";
							},
							"STP": function() {
								return "Sao Tome and Principe";
							},
							"SAU": function() {
								return "Saudi Arabia";
							},
							"SEN": function() {
								return "Senegal";
							},
							"SRB": function() {
								return "Serbia";
							},
							"SYC": function() {
								return "Seychelles";
							},
							"SLE": function() {
								return "Sierra Leone";
							},
							"SGP": function() {
								return "Singapore";
							},
							"SXM": function() {
								return "Sint Maarten (Dutch part)";
							},
							"SVK": function() {
								return "Slovakia";
							},
							"SVN": function() {
								return "Slovenia";
							},
							"SLB": function() {
								return "Solomon Islands";
							},
							"SOM": function() {
								return "Somalia";
							},
							"ZAF": function() {
								return "South Africa";
							},
							"SGS": function() {
								return "South Georgia and the South Sandwich Islands";
							},
							"SSD": function() {
								return "South Sudan";
							},
							"ESP": function() {
								return "Spain";
							},
							"LKA": function() {
								return "Sri Lanka";
							},
							"SDN": function() {
								return "Sudan";
							},
							"SUR": function() {
								return "Suriname";
							},
							"SJM": function() {
								return "Svalbard and Jan Mayen";
							},
							"SWZ": function() {
								return "Swaziland";
							},
							"SWE": function() {
								return "Sweden";
							},
							"CHE": function() {
								return "Switzerland";
							},
							"SYR": function() {
								return "Syrian Arab Republic";
							},
							"TWN": function() {
								return "Taiwan, Province of China";
							},
							"TJK": function() {
								return "Tajikistan";
							},
							"TZA": function() {
								return "Tanzania";
							},
							"THA": function() {
								return "Thailand";
							},
							"TLS": function() {
								return "Timor-Leste";
							},
							"TGO": function() {
								return "Togo";
							},
							"TKL": function() {
								return "Tokelau";
							},
							"TON": function() {
								return "Tonga";
							},
							"TTO": function() {
								return "Trinidad and Tobago";
							},
							"TUN": function() {
								return "Tunisia";
							},
							"TUR": function() {
								return "Turkey";
							},
							"TKM": function() {
								return "Turkmenistan";
							},
							"TCA": function() {
								return "Turks and Caicos Islands";
							},
							"TUV": function() {
								return "Tuvalu";
							},
							"UGA": function() {
								return "Uganda";
							},
							"UKR": function() {
								return "Ukraine";
							},
							"ARE": function() {
								return "United Arab Emirates";
							},
							"GBR": function() {
								return "United Kingdom";
							},
							"USA": function() {
								return "United States";
							},
							"UMI": function() {
								return "United States Minor Outlying Islands";
							},
							"URY": function() {
								return "Uruguay";
							},
							"UZB": function() {
								return "Uzbekistan";
							},
							"VUT": function() {
								return "Vanuatu";
							},
							"VEN": function() {
								return "Venezuela";
							},
							"VNM": function() {
								return "Viet Nam";
							},
							"VGB": function() {
								return "Virgin Islands, British";
							},
							"VIR": function() {
								return "Virgin Islands, U.S.";
							},
							"WLF": function() {
								return "Wallis and Futuna";
							},
							"ESH": function() {
								return "Western Sahara";
							},
							"YEM": function() {
								return "Yemen";
							},
							"ZMB": function() {
								return "Zambia";
							},
							"ZWE": function() {
								return "Zimbabwe";
							}
						};

						return countryLookupTable[val]();
					}
				};
			});
})();
