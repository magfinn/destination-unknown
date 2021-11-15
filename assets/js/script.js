// // set up variables:
// var searchBtn = $("#search-btn");
// //var clearBtn = $("clear-btn");
// var searchResult = $("#search-history");
// var todayWeather = $("#today-weather");
// var forecastWeather = $("#forecast-weather");
// var forecastTitle = $("#forecast-title");
// var cityInputName = $("#city-input");

// // set up variables:
// var searchBtn = $("#search-btn");
// //var clearBtn = $("clear-btn");
// var searchResult = $("#search-history");
// var todayWeather = $("#today-weather");
// var forecastWeather = $("#forecast-weather");
// var forecastTitle = $("#forecast-title");
// var cityInputName = $("#city-input");


// // current day variable
// currentDay = moment().format("MM[/]DD[/]YYYY");
// //console.log(currentDay);

// // variable for API keys
// var apiKey = "818c59d7f810b3a544e5b96a076c8332";

// var displayHistory = function(){
//     searchResult.empty();

// // for loop to persit the search data into the search history
// for (var i=0; i<localStorage.length; i++) {
//     var getCity = JSON.parse(localStorage.getItem(i));
//     searchResult.append("<p id='clickItem' class='search-item mt-2 col-12'>" + getCity + "</p>");
    
// }
// };

// //click event to get city name from the search history bar:
// $("#search-history").on("click", "p", (function() {
//     var cityNameOnClick = $(this).text().trim();
//     //console.log(cityNameOnClick);

//     //pass the city name to getWeatherData
//     getWeatherData(cityNameOnClick);
// }));

// // track the search count for local storage
// var searchCount = 0;

// //search button click event
// searchBtn.on("click", function(event) {
//     // prevent page from refreshing
//     event.preventDefault();

//     // get value of the input city name
//     var cityName = cityInputName.val().trim();

//     // make sure user input a city name, cannot be empty
//     if (cityName) {
//         getWeatherData(cityName);
//         //clear old content
//         cityInputName.val('');
//     } else {
//         alert("Invalid! Please enter a city.");
//     }
// });

// // // button to clear the history
// // clearBtn.on("click", function(event) {
// //     event.preventDefault();
// //     searchResult.empty();
// // });

// // get weather data from city name passed in from click event:
// var getWeatherData = function (city) {

//     // format the openweathermap api url for current weather:
//     currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
//     //console.log(currentUrl);
//     // format the openweathermap api url for 5-day forcast weather
//     forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
//     //console.log(forecastUrl);

//     // clear old data
//     todayWeather.empty();
//     forecastWeather.empty();
//     forecastTitle.empty();

//     //make a get request to url for current weather:
//     fetch(currentUrl).then(function(response) {
//         if (response.ok) {
//             response.json().then(function(data){
//                 displayCurrentWeather (data);
//                 //console.log(data);
                
//             });
//         } else {
//             alert(city + " is not a city!")
//         }
//         })
//         .catch (function(error) {
//             alert('Unable to connect to Weather App - Please check back later!');
//         });

//     //make a get request to url for current weather:
//     fetch(forecastUrl).then(function(response) {
//         if (response.ok) {
//             response.json().then(function(forecastData){
//                 displayForecastWeather(forecastData);
//                 //console.log(forecastData);
                
//             });
//         } else {
//             alert("Please check the spelling and enter a valid city name!")
//             // clear old data
//             todayWeather.removeClass();            
//         }
//         })
//         .catch (function(error) {
//             alert('The internet connection might have caused the issues!');
//         });
// };

// var displayCurrentWeather = function(data) {
//     //console.log(data);
     
//     //add border to main display
//     todayWeather.addClass("border border-dark");
//     // set local storage
//         // var searchStorage = localStorage.setItem(searchCount, data.name);
//         localStorage.setItem(searchCount, JSON.stringify(data.name));
//         searchCount = searchCount +1;
//         displayHistory();

//     //Append h2 city name with id to the main display container: 
//     todayWeather.append("<h2 class='city-name'>" + data.name + " (" + currentDay + ") " + "<img src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png'></h2>");
//     todayWeather.append("<p class='displayMain'>Temp: " + data.main.temp + " °F");
//     todayWeather.append("<p class='displayMain'>Wind: " + data.wind.speed + " MPH");
//     todayWeather.append("<p class='displayMain'>Humidity: " + data.main.humidity + " %");
    
//     //UV index has different api call:
//     var uvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;
//     //console.log(uvIndexUrl);
//     fetch(uvIndexUrl).then(function(response){
//         response.json().then(function(uvData){
//            //console.log(uvData.current.uvi);
//             if (uvData.current.uvi < 3) {
//                 todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge badge-success'>" + uvData.current.uvi + "</span>");
//             }
//             else if (uvData.current.uvi >= 3 && uvData.current.uvi < 6) {
//                 todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge badge-warning'>" + uvData.current.uvi + "</span>");
//             } else if (uvData.current.uvi > 6) {
//                 todayWeather.append("<p class='displayMain'>UV Index: " + "<span class = 'badge badge-danger'>" + uvData.current.uvi + "</span>");
//             };          
//         }
//     )});           
// };

// var displayForecastWeather = function(forecastData) {
//     //console.log(forecastData);

//     //because forecast displays in 3-hour range, the api responds 40 timestamps (8 for each day)
//     // for our purpose, we only select timestamps which starts at 12am, which are timestamps 0, 8, 16, 24 and 32
    
    
//     //set the array for the above mentioned timestamps:
//     var forecastDays = [0, 8, 16, 24, 32];

//     // set the nextdays
//     var nextDay1 = moment(currentDay).add(1, 'days').format("MM[/]DD[/]YYYY");
//     var nextDay2 = moment(currentDay).add(2, 'days').format("MM[/]DD[/]YYYY");
//     var nextDay3 = moment(currentDay).add(3, 'days').format("MM[/]DD[/]YYYY");
//     var nextDay4 = moment(currentDay).add(4, 'days').format("MM[/]DD[/]YYYY");
//     var nextDay5 = moment(currentDay).add(5, 'days').format("MM[/]DD[/]YYYY");
//     // console.log(nextDay1);
//     // console.log(nextDay2);
//     // console.log(nextDay3);
//     // console.log(nextDay4);
//     // console.log(nextDay5);
   
//     // create new div for each card forecast weather 
//     forecastTitle.append("<h3 class = 'mb-1'>5-Day Forecast:</h3>");

//     //append nextday forecast for the next 5 days
//     //day1
//     forecastWeather.append("<div id='cardDiv' class='card col-12 col-lg-2'>" + 
//     "<h4 class='mt-1'>" +  nextDay1 + "</h4>" +
//     "<img class = 'forecastIcon' src='https://openweathermap.org/img/wn/" + forecastData.list[0].weather[0].icon + "@2x.png'>" + 
//     "<p class='forecastP'> Temp: " + forecastData.list[0].main.temp + " °F</p>" +
//     "<p class='forecastP'> Wind: " + forecastData.list[0].wind.speed + " MPH</p>" +
//     "<p class='forecastP'> Humidity: " + forecastData.list[0].main.humidity + " %</p>" +
//     "</div>");   

//     //day2
//     forecastWeather.append("<div id='cardDiv' class='card col-12 col-lg-2'>" + 
//     "<h4 class='mt-1'>" +  nextDay2 + "</h4>" +
//     "<img class = 'forecastIcon' src='https://openweathermap.org/img/wn/" + forecastData.list[1].weather[0].icon + "@2x.png'>" + 
//     "<p class='forecastP'> Temp: " + forecastData.list[1].main.temp + " °F</p>" +
//     "<p class='forecastP'> Wind: " + forecastData.list[1].wind.speed + " MPH</p>" +
//     "<p class='forecastP'> Humidity: " + forecastData.list[1].main.humidity + " %</p>" +
//     "</div>");   

//     //day3
//     forecastWeather.append("<div id='cardDiv' class='card col-12 col-lg-2'>" + 
//     "<h4 class='mt-1'>" +  nextDay3 + "</h4>" +
//     "<img class = 'forecastIcon' src='https://openweathermap.org/img/wn/" + forecastData.list[2].weather[0].icon + "@2x.png'>" + 
//     "<p class='forecastP'> Temp: " + forecastData.list[2].main.temp + " °F</p>" +
//     "<p class='forecastP'> Wind: " + forecastData.list[2].wind.speed + " MPH</p>" +
//     "<p class='forecastP'> Humidity: " + forecastData.list[2].main.humidity + " %</p>" +
//     "</div>");   

//     //day4
//     forecastWeather.append("<div id='cardDiv' class='card col-12 col-lg-2'>" + 
//     "<h4 class='mt-1'>" +  nextDay4 + "</h4>" +
//     "<img class = 'forecastIcon' src='https://openweathermap.org/img/wn/" + forecastData.list[3].weather[0].icon + "@2x.png'>" + 
//     "<p class='forecastP'> Temp: " + forecastData.list[3].main.temp + " °F</p>" +
//     "<p class='forecastP'> Wind: " + forecastData.list[3].wind.speed + " MPH</p>" +
//     "<p class='forecastP'> Humidity: " + forecastData.list[3].main.humidity + " %</p>" +
//     "</div>"); 

//     //day5
//     forecastWeather.append("<div id='cardDiv' class='card col-12 col-lg-2'>" + 
//     "<h4 class='mt-1'>" +  nextDay5 + "</h4>" +
//     "<img class = 'forecastIcon' src='https://openweathermap.org/img/wn/" + forecastData.list[4].weather[0].icon + "@2x.png'>" + 
//     "<p class='forecastP'> Temp: " + forecastData.list[4].main.temp + " °F</p>" +
//     "<p class='forecastP'> Wind: " + forecastData.list[4].wind.speed + " MPH</p>" +
//     "<p class='forecastP'> Humidity: " + forecastData.list[4].main.humidity + " %</p>" +
//     "</div>"); 
// };

// displayHistory();

// trigger budget modal
// get modal form 
var modalBudget = $("#modal-budget");
//get modal button that opens the modal
var modalBudgetBtn = $(".budget-calculateBtn");
//get the button that closes the modal
var modalFormCloseBtn= $(".modal-budget-closeModal");

//when the user clicks the button, open the modal
// modalBudgetBtn.on("click", function() {
//     modalBudget.removeClass("modal-budget-hidden").addClasss("modal-budget-shown");
// });
modalBudgetBtn.on("click", function() {
    modalBudget.removeClass("modal-budget-hidden");
    modalBudget.addClass("modal-budget-shown");
});


