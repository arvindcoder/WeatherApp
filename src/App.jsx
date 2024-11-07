import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWeather, setShowWeather] = useState(null);

  // Fetch user's location
  useEffect(() => {
    function fetchLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError("Location access denied. Cannot retrieve weather data.");
        }
      );
    }
    fetchLocation();
  }, []);

  // Fetch weather data once location is available
  useEffect(() => {
    async function fetchWeather() {
      if (!location) return;

      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=1425c239777b1657074c974364f8ab58`
        );
        if (!res.ok) {
          throw new Error(`Error ${res.statusText}`);
        }
        const data = await res.json();
        setShowWeather(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  return (
    <div className="app">
      <div className="weather-container">
        <h1 className="title">Weather Forecast</h1>
        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2 className="error">{error}</h2>
        ) : showWeather ? (
          <div className="weather-card">
            <h2 className="location">{showWeather.name}</h2>
            <div className="weather-info">
              <h3 className="weather">{showWeather.weather[0].main}</h3>
              <h3 className="temperature">
                {Math.round((showWeather.main.temp - 273.15) * 10) / 10}°C
              </h3>
              <p className="details">
                Humidity: {showWeather.main.humidity}% | Wind:{" "}
                {Math.round(showWeather.wind.speed * 3.6)} km/h
              </p>
            </div>
          </div>
        ) : (
          <h2>Getting your current location...</h2>
        )}
      </div>
    </div>
  );
}
