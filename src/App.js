import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  function handleSearch(event) {
    event.preventDefault();

    const apiKey = "2d96d64425dca1d6eda00d942a281c0d";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(weatherUrl).then((response) => {
      setWeather({
        city: response.data.name,
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        wind: Math.round(response.data.wind.speed),
        icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      });
    });

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(forecastUrl).then((response) => {
      const daily = response.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );

      const formatted = daily.map((day) => {
        return {
          date: new Date(day.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          tempMax: Math.round(day.main.temp_max),
          tempMin: Math.round(day.main.temp_min),
          icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
        };
      });

      setForecast(formatted);
    });
  }

  return (
    <div className="App">
      <header>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="search"
            placeholder="Enter a city.."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {weather && (
        <div className="Weather">
          <h2>{weather.city}</h2>
          <div className="current">
            <img src={weather.icon} alt={weather.description} />
            <span className="temp">{weather.temperature}°C</span>
          </div>
          <p className="description">
            {weather.description}, Humidity: {weather.humidity}%, Wind:{" "}
            {weather.wind} km/h
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="Forecast">
          {forecast.map((day, index) => (
            <div className="day" key={index}>
              <h3>{day.date}</h3>
              <img src={day.icon} alt="" />
              <p>
                {day.tempMax}° / {day.tempMin}°
              </p>
            </div>
          ))}
        </div>
      )}

      <footer>
        This project was coded by{" "}
        <a href="https://github.com/Mafifiza/" target="_blank" rel="noreferrer">
          Refilwe Motaung
        </a>{" "}
        and is{" "}
        <a
          href="https://github.com/Mafifiza/homework-weather-app"
          target="_blank"
          rel="noreferrer"
        >
          open-sourced on GitHub
        </a>{" "}
        and{" "}
        <a
          href="https://mellow-otter-3d35b1.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          hosted on Netlify
        </a>
      </footer>
    </div>
  );
}
