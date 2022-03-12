"use strict";
function getWeatherIconUrl(weatherData) {
    return weatherData.weather[0].icon;
}
function fetchWeather(city, cb) {
    const API_KEY = "d42ab42f25488f794e82ac2c0d58a4cb";
    return $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&unit=metric`,
        type: "GET",
        success: cb
    });
}
function setup() {
    $(".prompt__input").on('keypress', e => {
        var _a;
        if (e.which === 13)
            fetchWeather(((_a = $(".prompt__input").val()) !== null && _a !== void 0 ? _a : ""), data => {
                $('.output__temp').text(data.main.temp);
                $('.output__icon').attr('src', `http://openweathermap.org/img/wn/${getWeatherIconUrl(data)}@2x.png`);
            });
    });
}
$(document).ready(setup);
