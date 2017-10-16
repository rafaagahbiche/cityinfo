mainApp
	.factory('weatherforecastService', function($http) {
		var weatherApi = {};
		var eventApiKey = 'pc39J6zVksjHRNnp'
		var apiUrl = "http://api.openweathermap.org/data/2.5/";
		var api = '2d3f3c632a918e9e16908ce030dcea6a';
	
		weatherApi.getWeatherForecast = function(latCity, lonCity) {
			var url = apiUrl + "forecast/daily";
			var param = { APPID: api, units: "metric", cnt: "5", lat: latCity, lon: lonCity };
			return $http.get(url, {params:param});
		}
		
		weatherApi.getWeatherToday = function(latCity, lonCity) {
			var url = apiUrl + "weather";
			var param = { APPID: api, units: "metric", lat: latCity, lon: lonCity };
			return $http.get(url, {params:param});
		}
		
		weatherApi.weatherclassService = function(code, isMorning) {
			var nightCode = isMorning ? "" : "-N";
			var classret = '';
			// Orage
			if (code >= 200 && code <= 232) {
				classret = 'sprite-07_thunderstorm' + nightCode;
			}

			// Nuage + pluies
			if ((code >= 300 && code <= 321) || (code >= 520 && code <= 531)) {
				classret = 'sprite-05_showerRain' + nightCode;
			}

			// soleil + pluies
			if (code >= 500 && code <= 504) {
				classret = 'sprite-06_rain' + nightCode;
			}

			//Neiges
			if (code >= 600 && code <= 622) {
				classret = 'sprite-08_snow' + nightCode;
			}

			//Bruumes
			if (code >= 701 && code <= 781) {
				classret = 'sprite-09_mist' + nightCode;
			}

			// Ciel d�gag�
			if (code == 800) {
				classret = 'sprite-01_skyIsClear' + nightCode;
			}
			
			// Soleil + nuages
			if (code == 801) {
				classret = 'sprite-02_fewClouds' + nightCode;
			}

			// Nuage 1
			if (code == 802 || code == 803) {
				classret = 'sprite-03_scatteredClouds' + nightCode;
			}

			// Nuage 2
			if (code == 804) {
				classret = 'sprite-04_brokenClouds' + nightCode;
			}
			
			return classret;
		}

		return weatherApi;
	});
	