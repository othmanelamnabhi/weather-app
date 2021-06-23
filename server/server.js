const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
var cors = require("cors");
const port = 3000;

app.use(cors());
app.get("/weather", ({ query }, res) => {
  const { lat, lon } = query;
  axios
    .get(`https://api.openweathermap.org/data/2.5/onecall`, {
      params: {
        lat,
        lon,
        appid: process.env.API_KEY,
        exclude: "minutely,alerts",
        units: "metric",
      },
    })
    .then(function ({ data }) {
      //res.send(response.data);
      res.json({
        hourly: getHourlyData(data),
        daily: getDailyData(data),
        current: getCurrentData(data),
        data,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

function getCurrentData({ current, daily }) {
  const { temp: currentTemp, wind_speed, weather } = current;
  const { feels_like, pop, temp } = daily[0];
  return {
    currentTemp: Math.round(currentTemp),
    wind_speed: Math.round(wind_speed),
    maxTemp: Math.round(temp.max),
    minTemp: Math.round(temp.min),
    feelsLikeMax: Math.round(Math.max(...Object.values(feels_like))),
    feelsLikeMin: Math.round(Math.min(...Object.values(feels_like))),
    description: weather[0].description,
    icon: weather[0].icon,
    precipitation: Math.round(pop * 100),
  };
}

function getDailyData({ daily }) {
  return daily.slice(1).map((day) => {
    return {
      icon: day.weather[0].icon,
      description: day.weather[0].description,
      day: day.dt * 1000,
      temp: Math.round(day.temp.day),
    };
  });
}

function getHourlyData({ hourly }) {
  return hourly.slice(1, 9).map((hour) => {
    return {
      hour: hour.dt * 1000,
      description: hour.weather[0].description,
      icon: hour.weather[0].icon,
      feels_like: Math.round(hour.feels_like),
      temp: Math.round(hour.temp),
      pop: Math.round(hour.pop * 100),
      wind_speed: hour.wind_speed,
    };
  });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
