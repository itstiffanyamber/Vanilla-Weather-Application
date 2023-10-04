// Function to format the date
function formatDate(now) {
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
  return `${day}, ${month} ${date}`;
}

// Get the current date
let current = new Date();

// Function to display weather data
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

  // Update HTML elements with weather data
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
}

// Function to search for weather by city
function search(city) {
  let apiKey = "f91094f9e909c81cb1790c946625748c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

// Function to display temperature in Celsius
function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Initialize Celsius temperature variable
let celsiusTemperature = null;

// Get the search form and add a submit event listener
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// Get the Celsius link and add a click event listener
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Default search for "Port Elizabeth" weather
search("Port Elizabeth");

// Function to get weather for the current location
function getCurrentLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiKey = "f91094f9e909c81cb1790c946625748c";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(apiUrl).then(displayTemperature);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Add click event listener to the location icon
let locationIcon = document.querySelector("#location-icon");
locationIcon.addEventListener("click", getCurrentLocationWeather);
