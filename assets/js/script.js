let fetchWeatherData = function (city) {

    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=889b46e79741b547a80f6dcc38bdd6e3&units=imperial')
        .then(function (response) { return response.json(); })
        .then(function (response) {
            longitude = response.coord.lon;
            latitude = response.coord.lat;

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&units=imperial&appid=889b46e79741b547a80f6dcc38bdd6e3')
                .then(function (weather) { return weather.json(); })
                .then(function (weather) {
                    console.log(weather);
                    cityName = city;
                    temperature = weather.current.temp;
                    windSpeed = weather.current.wind_speed;
                    humidity = weather.current.humidity;
                    uvIndex = weather.current.uvi;

                    iconLink = "http://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png"

                    iconCurrent = document.createElement('img');
                    iconCurrent.src = iconLink;
                    // $('#icon').append(iconCurrent);

                    for (i = 1; i < weather.daily.length; i++) {
                        date = moment().add((i), 'days').format("MMMM Do, YYYY");
                        iconLink = "http://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png"
                        temperatureWeek = weather.daily[i].temp.day;
                        windSpeedWeek = weather.daily[i].wind_speed;
                        humidityWeek = weather.daily[i].humidity;
                        uvIndexWeek = weather.daily[i].uvi;
                    }
                });
        });
}

let displayDate = function () {
    currentDate = moment().format("MMMM Do, YYYY");
    console.log(currentDate)
}

fetchWeatherData('Austin')
displayDate();


