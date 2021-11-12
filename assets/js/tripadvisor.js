tmRootURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=';
APIKey = 'NkBeiHfEIaAylIBwHGwoVNZQSg7Ahwx4';
tmConsumerSecret = 'NB4naItPPbbYH857';
searchBtn = $('#search-btn');
cityInput = $('#city-input');


var getEvents = function(data) {
    fetch(tmRootURL + cityName +'&apikey=' + APIKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    });
};
searchBtn.on('click', function(event) {
    event.preventDefault(); 
    var cityName = cityInput.val().trim();

    if(cityName) {
        getEvents(cityName);
        localStorage.setItem(cityName);
    } else {
        return;
    }
});
