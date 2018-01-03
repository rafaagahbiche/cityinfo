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
		
		// Thunder Storm
		if (code >= 200 && code <= 232) {
			classret = 'sprite-7' + nightCode;
		}

		// Shower Rain - Drizzle
		if ((code >= 300 && code <= 321) || (code >= 520 && code <= 531)) {
			classret = 'sprite-5' + nightCode;
		}

		// Rain
		if (code >= 500 && code <= 504) {
			classret = 'sprite-6' + nightCode;
		}

		// Snow
		if (code >= 600 && code <= 622) {
			classret = 'sprite-8' + nightCode;
		}

		// Mist
		if (code >= 701 && code <= 781) {
			classret = 'sprite-9' + nightCode;
		}

		// Sky Is Clear
		if (code == 800) {
			classret = 'sprite-1' + nightCode;
		}
		
		// Few Clouds
		if (code == 801) {
			classret = 'sprite-2' + nightCode;
		}

		// Cattered Clouds
		if (code == 802 || code == 803) {
			classret = 'sprite-3' + nightCode;
		}

		// Broken Clouds
		if (code == 804) {
			classret = 'sprite-4' + nightCode;
		}
		
		return classret;
	}

	return weatherApi;
});
