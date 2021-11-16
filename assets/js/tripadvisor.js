var tmRootURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=';
var APIKey = 'NkBeiHfEIaAylIBwHGwoVNZQSg7Ahwx4';
var tmConsumerSecret = 'NB4naItPPbbYH857';
var searchBtn = $('#search-btn');
var cityInput = $('#city-input');
var cityName = '';
var events = {};

//TODO: create a working function to display 10 events
var displayEvents = function(data) {
    //create elements that make up an event item
    var events = data._embedded.events;

    events.forEach(event => {
        console.log(event.name);
        console.log(event.url);
        console.log(event.dates.start.localDate);
        
    });
};



var getEvents = function() {
    var city = localStorage.getItem('cityName');
    console.log('city: ', cityName);
    
    fetch(tmRootURL + cityName +'&page=1&size=10&apikey=' + APIKey)

    .then(response =>
        response.json())
    .then(data => {
        console.log(data);
        displayEvents(data);
    });
};


searchBtn.on('click', function(event) {
    console.log("click");
    event.preventDefault(); 
    var cityName = cityInput.val().trim();
    localStorage.setItem('city', JSON.stringify(cityName));
    if(cityName) {
        getEvents();
        console.log(cityName);
        } else {
            return
        };
});
