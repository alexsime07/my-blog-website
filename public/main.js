// main.js
document.addEventListener('DOMContentLoaded', () => {
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const cityInput = document.getElementById('city-input');
  
    // Function to fetch and display weather data
    const fetchWeather = () => {
      const city = cityInput.value;
  
      if (city) {
        fetch(`/weather?city=${encodeURIComponent(city)}`)
          .then(response => response.json())
          .then(data => {
            const weatherInfo = document.getElementById('weather-info');
            if (data.error) {
              weatherInfo.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
              weatherInfo.innerHTML = `
                <p>Location: ${data.location.name}, ${data.location.country}</p>
                <p>Temperature: ${data.current.temp_c}°C</p>
                <p>Condition: ${data.current.condition.text}</p>
              `;
            }
          })
          .catch(error => {
            console.error('Error fetching weather data:', error.message);
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `<p>Unable to fetch weather data. Please try again later.</p>`;
          });
      } else {
        alert('Please enter a city name');
      }
    };
  
    // Event listener for the "Get Weather" button
    getWeatherBtn.addEventListener('click', fetchWeather);
  
    // Event listener for the "Enter" key press in the input field
    cityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        fetchWeather();
      }
    });
  });
  