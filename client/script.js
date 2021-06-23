const axios = require("axios");

// get current position

navigator.geolocation.getCurrentPosition(
  getCurrentPositionSuccess,
  getCurrentPositionError
);

function getCurrentPositionSuccess({ coords }) {
  getWeatherData(coords.latitude, coords.longitude);
}

function getCurrentPositionError(error) {
  console.log(error.message);
}

// get weather data for current position
function getWeatherData(lat, lon) {
  console.log(lat, lon);
  axios
    .get("http://localhost:3000/weather", {
      params: {
        lat,
        lon,
      },
    })
    .then(function (response) {
      renderWeatherData(response.data);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function renderWeatherData({ current, hourly, daily }) {
  document.querySelector("body").classList.remove("blurred");
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function setValue(base, selector, value) {
  base.querySelector(`[data-${selector}]`).textContent = value;
}

function fetchImage(base, selector, icon, { large = false } = {}) {
  const size = large ? "@2x" : "";
  base.querySelector(
    `[data-${selector}]`
  ).src = `http://openweathermap.org/img/wn/${icon}${size}.png`;
}

function renderCurrentWeather(current) {
  setValue(document, "current-temp", current.currentTemp);
  setValue(document, "current-description", current.description);
  setValue(document, "current-temp-max", current.maxTemp);
  setValue(document, "current-feels-like-max", current.feelsLikeMax);
  setValue(document, "current-wind-speed", current.wind_speed);
  setValue(document, "current-temp-min", current.minTemp);
  setValue(document, "current-feels-like-min", current.feelsLikeMin);
  setValue(document, "current-pop", current.precipitation);
  fetchImage(document, "current-icon", current.icon, { large: true });
}

function renderDailyWeather(daily) {
  const dayTemplate = document.querySelector("[data-day-card]");
  const daySection = document.querySelector(".day-section");
  daySection.innerHTML = "";
  daily.forEach((day) => {
    const dayTemplateClone = dayTemplate.content.cloneNode(true);
    console.log(dayTemplateClone);
    setValue(dayTemplateClone, "daily-date", getDateName(day.day));
    setValue(dayTemplateClone, "daily-day-temp", day.temp);
    fetchImage(dayTemplateClone, "daily-icon", day.icon);
    daySection.append(dayTemplateClone);
  });
}
function renderHourlyWeather(hourly) {
  const hourTemplate = document.querySelector("[data-hour-card]");
  const hourSection = document.querySelector("tbody");
  hourSection.innerHTML = "";
  hourly.forEach((hour) => {
    const hourTemplateClone = hourTemplate.content.cloneNode(true);

    setValue(hourTemplateClone, "hourly-date-name", getDateName(hour.hour));
    setValue(hourTemplateClone, "hourly-hour", getDateHour(hour.hour));
    setValue(hourTemplateClone, "hourly-temp", hour.temp);
    setValue(hourTemplateClone, "hourly-feels-like-temp", hour.feels_like);
    setValue(hourTemplateClone, "hourly-wind-speed", hour.wind_speed);
    setValue(hourTemplateClone, "hourly-precipitation", hour.pop);
    fetchImage(hourTemplateClone, "hourly-icon", hour.icon);
    hourSection.append(hourTemplateClone);
  });
}

function getDateName(dateInMS) {
  const dateObj = new Date(dateInMS);
  return dateObj.toLocaleString("default", { weekday: "long" });
}

function getDateHour(dateInMS) {
  const dateObj = new Date(dateInMS);
  return dateObj.toLocaleString("en-US", { hour: "numeric", hour12: true });
}
