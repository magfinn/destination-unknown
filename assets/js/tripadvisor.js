var tmRootURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=';
var APIKey = 'NkBeiHfEIaAylIBwHGwoVNZQSg7Ahwx4';
var searchBtn = $(".city-searchBtn");
var cityInputName = $("#city-input");
var eventContainer = $("#event-container");
var events = {};

var displayEvents = function(data) {
    //clear old data
    eventContainer.empty();
    //create elements that make up an event item
    var events = data._embedded.events;
    console.log(events);
    count=0

    // for each event, create elements and display name, date, link to purchase tickets and image
        events.forEach(event => {
            //shows each event
            console.log(events[count]);
            //create variable for each event
            var currentEvent=events[count];
            //create elements
            var eventDiv = document.createElement("div");
            var eventContainer = $("#event-container");
            var eventName = document.createElement('h5');
            var eventDate = document.createElement('p');
            var eventURL = document.createElement('p');


            //TODO: fit images to events or take out
            // var eventImg=currentEvent.images[4].url;
            // console.log(eventImg);
            // var eventImgDiv = document.createElement('div');
            // var eventImgFig = document.createElement('figure');
            // var imgTag = `<img src='${eventImg}'/>`
            // eventImgFig.append(imgTag);
            // eventImgDiv.append(eventImgFig);
            // eventImgFig.innerHTML+=imgTag;
            // eventDiv.appendChild(eventImgFig);

            //append elements
            eventName.append(currentEvent.name);
            eventDate.append(currentEvent.dates.start.localDate);
            eventURL.innerHTML+=`<a target ='_blank' class='card-footer-item' href= '${currentEvent.url}'><p>Purchase Tickets</p></a>`;

            //append parent elements
            eventDiv.appendChild(eventName);
            eventDiv.appendChild(eventDate);
            eventDiv.appendChild(eventURL);
            eventContainer.append(eventDiv);

            //add classes to DOM elements
            eventDiv.setAttribute("style", "border-radius:30px; background-color: var(--primary-color); padding: 3%; margin: 1%; align-items: center;");
            eventDate.setAttribute("style", "color: var(--secondary-color); text-align: center;");
            eventName.setAttribute("style", "color: var(--secondary-color); font weight: bolder; font-size: 2vh; text-align:center;");
            eventURL.setAttribute("style", "text-decoration: none; color: var(--secondary-color); text-align: center; font-size: 2vh");

            //go to the next event
            count++;
    });

};



var getEvents = function() {
    // var city = localStorage.getItem('cityName');
    var cityName = cityInputName.val().trim();
    console.log(cityName);
    console.log('city: ', cityName);
    
    fetch(tmRootURL + cityName +'&page=1&size=5&apikey=' + APIKey)

    .then(response =>
        response.json())
    .then(data => {
        console.log(data);
        displayEvents(data);
    });
    
};
