mainApp.controller('CityCtrl', CityCtrl);
function CityCtrl($scope, $window, weatherforecastService, eventsService) {
	$scope.eventsWithImage = [];
	$scope.eventsWithNoImage = [];
	$scope.FiveDaysWeatherForecast = [];
	$scope.weatherFound = false;
	$scope.eventsFound = false;
	$scope.loading = false;
	$scope.keyword = "";
	$scope.selectedCity = {};
	$scope.gPlace;
	$scope.UpdateSelectedCityInfo = function (GoogleResult){
		$scope.selectedCity.Latitude = GoogleResult.geometry.location.lat();
		$scope.selectedCity.Longitude = GoogleResult.geometry.location.lng();
		$scope.GetWeatherToday();
		$scope.GetWeatherNextFiveDays();
		$scope.GetEventsInCity();
		if ($window.innerWidth > 1024) {
			$scope.selectedCity.Image = GoogleResult.photos[0].getUrl({'maxWidth': 1024, 'maxHeight': 778});
			$scope.selectedCity.ImageHeight = "778px";
			$scope.selectedCity.ImageStyle = {'background-image' : 'url(' + $scope.selectedCity.Image + ')',
											  'height' : '778px' };
		} else {
			$scope.selectedCity.Image = GoogleResult.photos[0].getUrl({'maxWidth': 375, 'maxHeight': 250});
			$scope.selectedCity.ImageHeight = "250px";
			$scope.selectedCity.ImageStyle = {'background-image' : 'url(' + $scope.selectedCity.Image + ')',
			'height' : "250px" };
		}

		var addressObj = GoogleResult.address_components;
		if (addressObj !== null 
			&& addressObj !== undefined 
			&& addressObj.length > 0){
			$scope.selectedCity.Name = addressObj[0].long_name;
			$scope.selectedCity.Country = addressObj[addressObj.length - 1].short_name;
		}
	}

	$scope.GetEventsInCity = function() {
		$scope.loading = true;
		$scope.eventsFound = false;
		try {
			eventsService.getEvents($scope.keyword, $scope.selectedCity.Longitude,$scope.selectedCity.Latitude).then(function(response) {
				$scope.eventsWithImage.length = 0;
				$scope.eventsWithNoImage.length = 0;
				if (response.events !== null && response.events !== undefined && response.events.length > 0){
					for (var i = 0; i < response.events.length; i++) {
						var ev = response.events[i];
						if (ev.image != null) {
							var imgUrl = ev.image.block250.url;
							// var imgUrl = ev.image.perspectivecrop290by250.url;
							imgUrl = imgUrl.startsWith("http://") ? imgUrl : "http://" + imgUrl;
							$scope.eventsWithImage.push({ 
								title: ev.title, 
								description: ev.description, 
								venue: ev.venue_name,
								image: imgUrl, 
								time: new Date(ev.start_time) 
							});
						} else {
							$scope.eventsWithNoImage.push({ 
								title: ev.title, 
								description: ev.description, 
								time: new Date(ev.start_time) 
							});
						}
					}

					$scope.eventsFound = $scope.eventsWithImage.length > 0;
				} else {
					$scope.eventsFound = false;
				}

				$scope.loading = false;
			});
		}
		catch (ex) {
			$scope.loading = false;
			$scope.eventsFound = false;
		}
	}

	$scope.GetWeatherNextFiveDays = function(){
		weatherforecastService.getWeatherForecast(
				$scope.selectedCity.Latitude,
				$scope.selectedCity.Longitude)
			.then(function(response){
				$scope.FiveDaysWeatherForecast.length = 0;
				for (var i = 0; i < response.data.list.length; i++) {
					var w = response.data.list[i];
					$scope.FiveDaysWeatherForecast.push({
						temp : Math.round(w.temp.day),
						date: w.dt,
						temp_max : Math.round(w.temp.max),
						temp_min : Math.round(w.temp.min),
						description: w.weather[0].description,
						cssClass: weatherforecastService.weatherclassService(w.weather[0].id, true)
					});
				}
			}, function(){

			});
		
	}

	$scope.GetWeatherToday = function() {
		$scope.weatherFound = false;
		weatherforecastService.getWeatherToday(
			$scope.selectedCity.Latitude,
			$scope.selectedCity.Longitude).then(function(response) {
			$scope.selectedCity.Temp = Math.round(response.data.main.temp);
			$scope.selectedCity.Description = response.data.weather[0].description;
			$scope.selectedCity.code = response.data.weather[0].id;
			$scope.selectedCity.isMorning = response.data.weather[0].icon.indexOf('d') > -1;
			$scope.selectedCity.weatherClass = weatherforecastService
				.weatherclassService($scope.selectedCity.code, $scope.selectedCity.isMorning);
			$scope.weatherFound = true;
		}, function errorCallback(response) {
			console.log(response);
			$scope.weatherFound = false;
		});
	}
}
