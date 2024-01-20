function updateWeather(response) {
  let temperatureElement = document.querySelector("#current-temperature-value");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#desciption-weather");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind-value");
  let timeElement = document.querySelector("#current-date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#weather-emoji");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed}km/h`;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-icon"/>`;
  temperatureElement.innerHTML = Math.round(temperature);

  getForecast(response.data.city);
}

// DATE
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  let days = [
    "Sunday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}, ${hours}:${minutes}`;
}

// API CALL
function searchCity(city) {
  let apiKey = "9t4ae39180bc03c6079f49f3f02o4cd0";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then((response) => {
    updateWeather(response);
    sunriseHours(response);
    sunsetHours(response);
  });
}

// CITY FORM
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("London");

// SUNRISE
function sunriseHours(response) {
  let city = response.data.city;
  let apiKey = "5cef9bdee3d7a31bbfc11fb0c68e1950";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  axios.get(apiUrl).then(sunrise);
}

function sunrise(response) {
  let sunriseElement = document.querySelector("#today-sunrise-hour");
  let date = new Date(response.data.sys.sunrise * 1000);
  sunriseElement.innerHTML = formatDateRiseAndSet(date);
}

// SUNSET
function sunsetHours(response) {
  let city = response.data.city;
  let apiKey = "5cef9bdee3d7a31bbfc11fb0c68e1950";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  axios.get(apiUrl).then(sunset);
}

function sunset(response) {
  let sunsetElement = document.querySelector("#today-sunset-hour");
  let date = new Date(response.data.sys.sunset * 1000);
  sunsetElement.innerHTML = formatDateRiseAndSet(date);
}

// SUNRISE AND SUNSET FORMATED DATE
function formatDateRiseAndSet(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  let days = [
    "Sunday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "9t4ae39180bc03c6079f49f3f02o4cd0";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
  
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max">
              ${Math.round(day.temperature.maximum)}º
            </span>
            <span> / </span>
            <span class="weather-forecast-temperature-min">${Math.round(
              day.temperature.minimum
            )}º</span>
          </div>
        </div>`;
    }
  });

  let forecastElement = document.querySelector("#weather-forecast");
  forecastElement.innerHTML = forecastHtml;
}
