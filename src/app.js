// Initialize variables
let celsiusTemperature = null; // Variable to store temperature in Celsius
let current = new Date(); // Current date
let form = document.querySelector("#search-form"); // Search form element
let celsiusLink = document.querySelector("#celsius-link"); // Celsius temperature link
let locationIcon = document.querySelector("#location-icon"); // Location icon

// Event listeners
form.addEventListener("submit", handleSubmit); // Listen for form submission
celsiusLink.addEventListener("click", displayCelsiusTemperature); // Listen for Celsius temperature link click
locationIcon.addEventListener("click", getCurrentLocationWeather); // Listen for location icon click

// Initial weather search for Cape Town
search("Cape Town");

// Function to format the date and time
function formatDate(now) {
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let date = now.getDate();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  return `${day}, ${month} ${date} | ${hours}:${minutes}`;
}

// Function to format the day of the week
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// Function to format hour
function formatHour(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  let minutes = date.getMinutes();
  return `${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
}

// Function to display current weather data
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let weatherDescriptionElement = document.querySelector(
    "#weather-description"
  );
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(current);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
  displayWeeklyForecast(response.data.coord); // Display weekly forecast
}

// Function to display temperature in Celsius
function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Function to initiate a weather search
function search(city) {
  let apiKey = "b46613281993492485b30d1857eea99b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

// Function to display daily weather forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML += `
        <div class="col">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
            src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="42"
          />
          <div class="weather-forecast-temperature">
            <span class="weather-forecast-temperature-max"> ${Math.round(
              forecastDay.temp.max
            )}°</span>
            <span class="weather-forecast-temperature-min"> ${Math.round(
              forecastDay.temp.min
            )}°</span>
          </div>
        </div>
      `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Function to display weekly weather forecast
function displayWeeklyForecast(coordinates) {
  let apiKey = "b46613281993492485b30d1857eea99b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(function (response) {
    displayForecast(response);
  });
}

// Function to get and display weather forecast
function getForecast(coordinates) {
  let apiKey = "b46613281993492485b30d1857eea99b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Function to get and display hourly forecast
function getHourlyForecast(coordinates) {
  let apiKey = "b46613281993492485b30d1857eea99b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayHourlyForecast);
}

// Function to display hourly forecast
function displayHourlyForecast(response) {
  let hourlyForecast = response.data.hourly;
  let hourlyForecastContainer = document.querySelector("#hourly-forecast");

  // Clear previous forecast data
  hourlyForecastContainer.innerHTML = "";

  // Iterate through the hourly forecast data and display it
  for (let i = 0; i < 4 * 24; i += 8) {
    let forecastHour = hourlyForecast[i];
    let forecastTimestamp = forecastHour.dt * 1000;
    let forecastIcon = forecastHour.weather[0].icon;

    let day = formatDay(forecastTimestamp);
    let hour = formatHour(forecastTimestamp);

    // Create a card for each day's forecast
    let forecastCard = document.createElement("div");
    forecastCard.classList.add("col");
    forecastCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${day}</h5>
          <p class="card-text">${hour}</p>
          <img
            src="https://openweathermap.org/img/wn/${forecastIcon}.png"
            alt=""
            width="50"
          />
        </div>
      </div>
    `;

    hourlyForecastContainer.appendChild(forecastCard);
  }
}

// Function to get current location weather
function getCurrentLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      let apiKey = "b46613281993492485b30d1857eea99b";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      axios.get(apiUrl).then(displayTemperature);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
