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
            var eventImg = currentEvent.images[4].url;
            console.log(eventImg);
            //each event name
            var eventDiv = document.createElement("div");
            var eventName = document.createElement('h5');
            var eventDate = document.createElement('p');
            var eventURL = document.createElement('div');
            var eventImgDiv = document.createElement('div');displayEvents
            var eventDiv.addClass('')
            var imgTag = `<img style ='' width='50px' height='50px' src='${eventImg}'/>`
            eventDate.append(currentEvent.dates.start.localDate);
            eventName.append(currentEvent.name);
            eventURL.innerHTML+=`<a target='_blank' href='${currentEvent.url}'><p>Purchase Tickets</p></a>`;
            eventImgDiv.innerHTML+=imgTag;
            // eventLink.append(currentEvent.url);
            // eventDiv.append(eventDate);
            eventDiv.appendChild(eventDate);
            eventDiv.appendChild(eventName);
            eventDiv.appendChild(eventURL);
            eventContainer.append(eventDiv);
            eventDiv.append(eventImgDiv);

            eventDiv.setAttribute("style", "display:flex; width:18%; height: auto; margin:0%; align-items:center; flex-direction:column; border: 1pt solid; border-radius:20px");
            //use bulma and set class to "columns"(2 columns of 3 events each)
            // backgroundImage: url(${eventImg}); backgroundSize: cover;
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
    
    fetch(tmRootURL + cityName +'&page=1&size=6&apikey=' + APIKey)

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
