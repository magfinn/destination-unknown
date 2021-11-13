var tmRootURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=';
var APIKey = 'NkBeiHfEIaAylIBwHGwoVNZQSg7Ahwx4';
var tmConsumerSecret = 'NB4naItPPbbYH857';
var searchBtn = $('#search-btn');
var cityInput = $('#city-input');
var cityName = '';
var events = {};

//TODO: create a working function to display 10 events in a table
var displayEvents = function(events) {
    //create elements that make up an event item
    var eventTbl = $('<tr>').addClass ("list-group-item");
    var name = $('<th>').text(eventName);
    var date = $('<th>').text(eventDate);
    var url = $('<th>').text(eventURL);

};


var saveEvents = function() {
    localStorage.setItem("events", JSON.stringify(events));
};



var getEvents = function(data) {
    var city = localStorage.getItem('cityName');
    console.log('city: ', JSON.parse(city));
    
    fetch(tmRootURL + cityName +'&page=1&size=10&apikey=' + APIKey)

    .then(response =>
        response.json())
    .then(data =>
        console.log(data));
        displayEvents(data)
};


searchBtn.on('click', function(event) {
    event.preventDefault(); 
    var cityName = cityInput.val().trim();
    localStorage.setItem('city', JSON.stringify(cityName));
    if(cityName) {
        getEvents(cityName);
        console.log(cityName);
        } else {
            return
        };
});
