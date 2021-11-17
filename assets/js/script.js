// BUDGET SECTION STARTS
// trigger budget modal
// get modal form 
var modalBudget = $("#modal-budget");
//get modal button that opens the modal
var modalBudgetBtn = $(".budget-calculateBtn");
//get the button that closes the modal
var modalFormCloseX= $(".modal-budget-closeModal");
//get modal close btn 
var modalCloseBtn=$(".modal-budget-closeBtn");
//get modal save btn 
var modalSaveBtn=$(".modal-budget-saveBtn");
//get modal-values
var modalNumberOfTraveler = $(".modal-budget-NumberOfTraveler");
var modalEachTraveler= $(".modal-budget-eachTraveler");
var modalUnexpectedCost = $(".modal-budget-unexpectedCost");
var modalDepartureDate = $(".modal-budget-departureDate");
var cityInputName = $("#city-input");


//when the user clicks the budget calculator button, open the modal
modalBudgetBtn.on("click", function() {
    modalBudget.removeClass("modal-budget-hidden");
    modalBudget.addClass("modal-budget-shown");

    //clear old data
    modalNumberOfTraveler.val('');
    modalEachTraveler.val('');
    modalUnexpectedCost.val('');
    modalDepartureDate.val('');
});

//when the user clicks the span X button, close the modal
modalFormCloseX.on("click", function() {
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})
//when the user clicks the close button in modal form, close the modal
modalCloseBtn.on("click", function() {
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})

//convert text field into a jquery date picker
    modalDepartureDate.datepicker ({
        minDate: 1,
});

//get data when user clicks the save button in the modal form, then close the modal
modalSaveBtn.on("click",function() {
    //get modal form values
    var numberOfTravelerVal = $(".modal-budget-NumberOfTraveler").val();
    var eachTravelerVal = $(".modal-budget-eachTraveler").val();
    var unexpectedCostVal = $(".modal-budget-unexpectedCost").val();
    var departureDateVal = $(".modal-budget-departureDate").val();
    departureDate = moment(moment(departureDateVal).format("MM,DD,YYYY"));
    //console.log(departureDate);

    currentDay = moment(moment().format("MM,DD,YYYY"));
    //console.log(currentDay);
    diffDay = departureDate.diff(currentDay,'days');
    //console.log(diffDay);

    var totalCostGroup = (numberOfTravelerVal * eachTravelerVal)+(numberOfTravelerVal * unexpectedCostVal);
    //console.log(totalCostGroup);
    averageGroup = Math.round((totalCostGroup/diffDay)*100)/100;
    //console.log(averageGroup);
    var totalCostEach = (eachTravelerVal*1) + (unexpectedCostVal*1);
    //console.log(totalCostEach);
    averageEach = Math.round((totalCostEach/diffDay)*100)/100;
    
    
    if (numberOfTravelerVal && eachTravelerVal && unexpectedCostVal && departureDateVal) {
        $(".budget-calculatorDatails").empty();
        $(".budget-calculatorDatails").append(
            "<ul><span class='boldText'>You entered: </span>" +
            "<li><span class='boldText'>" + numberOfTravelerVal + "</span>\xa0traveler/s</li>" + 
            "<li>Each traveler\'s estimated cost of <span class='boldText'>$" + eachTravelerVal + ",</span></li>" +
            "<li>The allowable unexpected costs of <span class='boldText'>$" + unexpectedCostVal + "</span>, and</li>" +
            "<li> Your departure date is\xa0<span class='boldText'>" + departureDateVal + ".</span></li></ul>"
        )
        $(".budget-calculatorDatails").append(
            "<ul><span class='boldText'>Based on the information provided, there is/are\xa0"+ diffDay + "\xa0day/s remaining until your departure. We'd suggest that:</span>" +
             "<li>Your group to save at least <span class='bold-text'>$" + totalCostGroup + "</span>\xa0for the entire trip, or <span class='bold-text'>$" + averageGroup + "</span>\xa0per day for\xa0<span class='bold-text'>" + diffDay +"</span>\xa0day/s, or </li>" +
             "<li>Each individual traveler to save at least <span class='bold-text'>$" + totalCostEach + "</span>\xa0for the entire trip, or <span class='bold-text'>$" + averageEach + "</span>\xa0per day for\xa0<span class='bold-text'>" + diffDay +"</span>\xa0day/s. </li></ul>"

        )
    }

    //close the modal after save
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})
// BUDGET SECTION ENDS

// JUMBOTRON form input to get city name - START

// set up variables:
var searchBtn = $(".city-searchBtn");
var cityInputName = $(".where-to");
var todayWeather = $(".current-weather");

// current day variable
currentDay = moment().format("MM[/]DD[/]YYYY");

// variable for API keys
var apiKey = "818c59d7f810b3a544e5b96a076c8332";

// track the search count for local storage
var searchCount = 0;

//search button click event
searchBtn.on("click", function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value of the input city name
    var cityName = cityInputName.val().trim();
    console.log(cityName);

    // make sure user input a city name, cannot be empty
    if (cityName) {
        getWeatherData(cityName);
        getEvents();
        //clear old content
        cityInputName.val('');
    } else {
        return;
    }
});
// get weather data from city name passed in from click event:
var getWeatherData = function (city) {

    // format the openweathermap api url for current weather:
    currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    //console.log(currentUrl);

    // clear old data
    todayWeather.empty();

    //make a get request to url for current weather:
    fetch(currentUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                displayCurrentWeather (data);               
            });
        } else {
            return;
        }
        })
    };
    var displayCurrentWeather = function(data) {         
        // set local storage
        // var searchStorage = localStorage.setItem(searchCount, data.name);
        localStorage.setItem(searchCount, JSON.stringify(data.name));
        searchCount = searchCount +1;
                
        //Append h2 city name with id to the main display container: 
        todayWeather.append("<h2 class='city-name'>" + data.name + " (" + currentDay + ")</h2>" + "<img src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png'>");
        todayWeather.append("<p class='displayMain'>Temp: " + data.main.temp + " °F");
        todayWeather.append("<p class='displayMain'>Wind: " + data.wind.speed + " MPH");
        todayWeather.append("<p class='displayMain'>Humidity: " + data.main.humidity + " %");
        
        //UV index has different api call:
        var uvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;
        //console.log(uvIndexUrl);
        fetch(uvIndexUrl).then(function(response){
            response.json().then(function(uvData){
               //console.log(uvData.current.uvi);
                if (uvData.current.uvi < 3) {
                    todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge-success'>" + uvData.current.uvi + "</span>");
                }
                else if (uvData.current.uvi >= 3 && uvData.current.uvi < 6) {
                    todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge-warning'>" + uvData.current.uvi + "</span>");
                } else if (uvData.current.uvi > 6) {
                    todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge-danger'>" + uvData.current.uvi + "</span>");
                };          
            }
        )});           
    };