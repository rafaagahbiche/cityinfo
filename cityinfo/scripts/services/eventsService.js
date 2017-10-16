mainApp
.factory('eventsService', function($q) {
    var eventsApi = {};
    eventsApi.getEvents = function(city, lon, lat) {
        var deferred = $q.defer();
        var eventApiKey = 'pc39J6zVksjHRNnp';
        var oArgs = {
            app_key: eventApiKey,
            // where: lon + ','+lat,
            location: city, 
            date: "This week",
            image_sizes: "block250",
            // image_sizes: "perspectivecrop290by250",
            include: "popularity"
        };

        EVDB.API.call("/events/search", oArgs, function(oData) {
            deferred.resolve({ events: oData.events.event });
        });
            
        return  deferred.promise;
    }

    return eventsApi;
});
