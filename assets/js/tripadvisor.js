var tmRootURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=';
var APIKey = 'NkBeiHfEIaAylIBwHGwoVNZQSg7Ahwx4';
// var tmConsumerSecret = 'NB4naItPPbbYH857';
var searchBtn = $(".city-searchBtn");
var cityInputName = $("#city-input");
var eventContainer = $(".event-container");
// var cityName = '';
var events = {};

//TODO: create a working function to display 10 events
var displayEvents = function(data) {
    //clear old data
    eventContainer.empty();
    //create elements that make up an event item
    var events = data._embedded.events;
    console.log(events);
    count=0

        // var eventContainer = $(".event-container");
 
        // var eventDiv = $(".event");


        events.forEach(event => {
            //shows each event
            console.log(events[count]);
            //create variable for each event
            var currentEvent=events[count];
            //each event name
            var eventDiv = document.createElement("div");
            var eventName = document.createElement('h5');
            var eventDate = document.createElement('p');
            var eventURL = document.createElement('p');
            eventDate.append(currentEvent.dates.start.localDate);
            eventName.append(currentEvent.name);
            eventURL.innerHTML+=`<p><a href= $('currentEvent.url')>Purchase Tickets</a></p>`;
            // eventLink.append(currentEvent.url);
            // eventDiv.append(eventDate);
            eventDiv.appendChild(eventDate);
            eventDiv.appendChild(eventName);
            eventDiv.appendChild(eventURL);
            eventContainer.append(eventDiv);

            eventDiv.setAttribute("style", "display:flex; width:18%; margin:0%; align-items:center; flex-direction:column; border: 1pt solid; border-radius:20px; background: whitesmoke");
            eventName.setAttribute("style", "text-align: center; font-size: 1vh")
            eventURL.setAttribute("style", "text-decoration: none; color: #2f4f4f; text-align: center")
            eventDate.setAttribute("style", "text-align: center");

            count++;



});
};



var getEvents = function() {
    // var city = localStorage.getItem('cityName');
    var cityName = cityInputName.val().trim();
    console.log(cityName);
    console.log('city: ', cityName);
    
    fetch(tmRootURL + cityName +'&page=1&size=10&apikey=' + APIKey)

    .then(response =>
        response.json())
    .then(data => {
        console.log(data);
        displayEvents(data);
    });
};

// searchBtn.on('click', function(event) {
//     console.log("click");
//     event.preventDefault();

//     // var cityName = cityInputName.val().trim();
//     // console.log(cityName);

//     localStorage.setItem('city', JSON.stringify(cityName));
//     if(cityName) {
//         getEvents();
//         } else {
//             return;
//         };
// });
