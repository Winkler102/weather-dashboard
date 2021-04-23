let cityHistory = [];

let fetchWeatherData = function (city) {
    console.log(city);

    // fetch location Longitude and latitude
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=889b46e79741b547a80f6dcc38bdd6e3&units=imperial')
        .then(function (response) { return response.json(); })
        .then(function (response) {
            longitude = response.coord.lon;
            latitude = response.coord.lat;

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
}

let displayDate = function () {
    currentDate = moment().format("MMMM Do, YYYY");
    $('#dateCurrent').append(currentDate);
}

let displayCurrent = function () {
    $('#cityName').append(cityName);
    $('#tempCurrent').append(temperature);
    $('#windCurrent').append(windSpeed);
    $('#humidCurrent').append(humidity);
    $('#uviCurrent').append(uvIndex);


    $('#iconCurrent')
        .addClass('iconCurrentImg')
        .attr('src', iconLink);

}

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

let clearAll = function () {
    $('#cityName').empty();
    $('#tempCurrent').empty();
    $('#windCurrent').empty();
    $('#humidCurrent').empty();
    $('#uviCurrent').empty();
    $('#forecastList').empty();
};

let getCityName = function () {
    cityNameInputEl = $("#cityNameInput").val();
    cityHistory.push(cityNameInputEl)
    console.log(cityHistory);
    return cityNameInputEl;
}

displayDate();

$("#cityNameForm").submit(function (event) {
    event.preventDefault();
    clearAll();
    fetchWeatherData(getCityName());
    $('#cityNameInput').val('');
});