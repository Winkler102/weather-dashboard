let cityHistory = [];

let fetchWeatherData = function (city) {
    clearAll();
    // fetch location Longitude and latitude
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=889b46e79741b547a80f6dcc38bdd6e3&units=imperial')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    longitude = data.coord.lon;
                    latitude = data.coord.lat;

                    // fetch weather information 
                    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&units=imperial&appid=889b46e79741b547a80f6dcc38bdd6e3')
                        .then(function (weather) { return weather.json(); })
                        .then(function (weather) {

                            // Place weather info into varibles
                            cityName = city;
                            temperature = weather.current.temp;
                            windSpeed = weather.current.wind_speed;
                            humidity = weather.current.humidity;
                            uvIndex = weather.current.uvi;
                            iconLink = "https://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png"

                            // Diplay weather info
                            displayCurrent();

                            // Get info for 7 day forecast by loop
                            for (i = 1; i < weather.daily.length; i++) {
                                dateWeek = moment().add((i), 'days').format("MMMM Do, YYYY");
                                iconLinkWeek = "https://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png"
                                temperatureWeek = weather.daily[i].temp.day + " F";
                                windSpeedWeek = weather.daily[i].wind_speed + " MPH";
                                humidityWeek = weather.daily[i].humidity + " %";
                                uvIndexWeek = "UV: " + weather.daily[i].uvi;
                                iconImgWeek = document.createElement("img");
                                iconImgWeek.classList.add("col-2");
                                iconImgWeek.src = iconLinkWeek;
                                weekInfo = [dateWeek, temperatureWeek, windSpeedWeek, humidityWeek, uvIndexWeek]
                                addForecastList();
                            }
                        });
                });
                // display search history after a search
                displayHistory();
                // save last seen so that it will pull up when opening site
                localStorage.setItem("lastSeen", city)
            } else {
                // check for errors
                alert("Error: City " + response.statusText);
                cityHistory.pop();
                saveHistory();
                displayHistory();
                fetchWeatherData(localStorage.getItem("lastSeen"));
            }

        })
        // handling for no connection
        .catch(function (error) {
            alert("Unable to connect to Open Weather");
        });
}

// displays date for current day
let displayDate = function () {
    currentDate = moment().format("MMMM Do, YYYY");
    $('#dateCurrent').append(currentDate);
}

// displays info for current weather
let displayCurrent = function () {
    $('#cityName').append(cityName);
    $('#tempCurrent').append(temperature);
    $('#windCurrent').append(windSpeed);
    $('#humidCurrent').append(humidity);
    $('#uviCurrent').append(uvIndex);

    if (uvIndex < 3) {
        $('#uviCurrent').addClass('lowUV')
    } else if (uvIndex < 6) {
        $('#uviCurrent').addClass('moderateUV')
    } else if (uvIndex < 8) {
        $('#uviCurrent').addClass('highUV')
    } else if (uvIndex < 11) {
        $('#uviCurrent').addClass('veryHighUV')
    } else {
        $('#uviCurrent').addClass('extremeUV')
    }


    $('#iconCurrent')
        .addClass('iconCurrentImg')
        .attr('src', iconLink);

}

// displays info for 7-day forecast
let addForecastList = function () {
    $('#forecastList').append("<li class='row day" + i + "'></li>")

    for (x = 0; x < weekInfo.length; x++) {
        weekAddp = $('<p>');
        weekAddp.addClass("col-2 p-3 m-0");
        weekAddp.text(weekInfo[x]);
        $(".day" + i).append(weekAddp);
    }
    $(".day" + i).append(iconImgWeek);
    if ((i % 2) === 0) {
        $(".day" + i).addClass('colored-background-light')
    } else {
        $(".day" + i).addClass('colored-background-dark')
    }
}

// clears info for new information
let clearAll = function () {
    $('#cityName').empty();
    $('#tempCurrent').empty();
    $('#windCurrent').empty();
    $('#humidCurrent').empty();
    $('#uviCurrent').empty();
    $('#forecastList').empty();
};

// gets city name from input box
let getCityName = function () {
    cityNameInputEl = $("#cityNameInput").val();
    cityHistory.push(cityNameInputEl)
    saveHistory(cityNameInputEl);
    return cityNameInputEl;
}

// save search history data
let saveHistory = function () {
    removeDuplicates();
    localStorage.setItem("history", JSON.stringify(cityHistory))
}

// load search history data
let loadHistory = function () {
    cityHistory = localStorage.getItem("history");
    if (cityHistory) {
        cityHistory = JSON.parse(cityHistory);
        fetchWeatherData(localStorage.getItem("lastSeen"));
    } else {
        cityHistory = [];
        fetchWeatherData('New York');
    }
    displayHistory();
}

// prevents duplicate entrys into search history 
let removeDuplicates = function () {
    let clearDulpicates = new Set(cityHistory)
    cityHistory = Array.from(clearDulpicates);
}

// displays search history as buttons that display each city
let displayHistory = function () {
    removeDuplicates();
    $('#searchHistory').empty();

    for (y = 0; y < cityHistory.length; y++) {
        $('#searchHistory').append("<button type='button' class='btn btn-secondary m-2' onclick='fetchWeatherData(`" + cityHistory[y] + "`)'>" + cityHistory[y] + "</button>")
    }
}

// run when opening site
loadHistory();
displayDate();

// handle submissions
$("#cityNameForm").submit(function (event) {
    event.preventDefault();
    fetchWeatherData(getCityName());
    $('#cityNameInput').val('');
});