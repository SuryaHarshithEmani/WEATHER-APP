let cityInput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchbtn');
let api_key = '178bf50de142b97d4ee247bb14597dc7'; //  OpenWeatherMap API key

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getCityCoordinates() {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(geoURL)
    .then(res => res.json())
    .then(data => {
      if (!data.length) throw new Error('City not found');
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(err => alert('Could not get location'));
}

function getWeatherDetails(name, lat, lon) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;

  // Current weather
  fetch(weatherURL)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;
      const pressure = data.main.pressure;

      document.getElementById('nowSection').innerHTML = `
        <div class="card">
          <h3>Now</h3>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
          <div class="details">
            <h2>${temp}&deg;C</h2>
            <p>${desc}</p>
          </div>
        </div>
      `;

      document.getElementById('highlights').innerHTML = `
        <div class="card"><h3>Humidity</h3><h2>${humidity}%</h2></div>
        <div class="card"><h3>Pressure</h3><h2>${pressure} hPa</h2></div>
        <div class="card"><h3>Wind Speed</h3><h2>${wind} m/s</h2></div>
      `;
    });

  // 5-day forecast
  fetch(forecastURL)
    .then(res => res.json())
    .then(data => {
      const forecastHTML = [];
      data.list.forEach((item, index) => {
        if (index % 8 === 0) {
          const date = new Date(item.dt_txt);
          const day = days[date.getDay()];
          const icon = item.weather[0].icon;
          const temp = Math.round(item.main.temp);

          forecastHTML.push(`
            <div class="card forecast-card">
              <h4>${day}</h4>
              <img src="https://openweathermap.org/img/wn/${icon}.png">
              <h4>${temp}&deg;C</h4>
            </div>
          `);
        }
      });

      document.getElementById('forecast').innerHTML = forecastHTML.join('');
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
