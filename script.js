// Constants for DOM elements
const cityInput = document.querySelector('.city-input');
const searchForm = document.querySelector('.search-form');
const temperatureValue = document.querySelector('.temp-unit');
const timeElement = document.querySelector('.time');
const dayElement = document.querySelector('.day');
const descriptionText = document.querySelector('.description-text');
const humidityValue = document.querySelector('.humidity');
const visibilityValue = document.querySelector('.visibility-distance');
const windSpeed = document.querySelector('.wind-speed');
const sunriseTime = document.querySelector('.sunrise-time');
const sunsetTime = document.querySelector('.sunset-time');
const uvIndexValue = document.querySelector('.uv-index-value');
const pressureValue = document.querySelector('.pressure-value');
const forecastContainer = document.querySelector('.forecast-container');
const unitToggle1 = document.querySelector('.unit-toggle1');
const unitToggle2 = document.querySelector('.unit-toggle2');

// API endpoint and key
const apiKey = '64f60853740a1ee3ba20d0fb595c97d5'; // Replace with your weather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// Current unit: 'metric' for Celsius, 'imperial' for Fahrenheit
let currentUnit = 'metric';

// Function to fetch weather data based on city
async function getWeatherData(city) {

    const weatherResponse = await fetch(`${apiUrl}weather?q=${city}&units=${currentUnit}&appid=${apiKey}`);
    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(`${apiUrl}forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    updateWeatherInfo(weatherData);
    updateForecast(forecastData);
}

// Function to update current weather info
function updateWeatherInfo(data) {


    // Temperature
    const temp = data.main.temp;
    temperatureValue.textContent = `${temp}°`;

    const tempUnit = document.querySelector('.temp-unit');
    tempUnit.innerHTML = `${temp}<sup>°</sup>${currentUnit === 'metric' ? 'C' : 'F'}`;




    // Day and Time
    const date = new Date();
    const day = date.toLocaleString('en-US', { weekday: 'long' });
    const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    dayElement.textContent = day;
    timeElement.textContent = time;

    // Weather description
    descriptionText.textContent = data.weather[0].description;

    // Humidity
    humidityValue.textContent = `${data.main.humidity}%`;

    // Visibility
    visibilityValue.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Wind speed and direction
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // converting m/s to km/h
    const windDirection = getWindDirection(data.wind.deg);
    windSpeed.innerHTML += ` <span> ${windDirection}</span>`;

    // Sunrise and sunset
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    sunriseTime.textContent = sunrise;
    sunsetTime.textContent = sunset;

    // UV index (assuming we are using a separate UV API request)
    getUVIndex(data.coord.lat, data.coord.lon);

    // Pressure
    pressureValue.textContent = `${data.main.pressure} hPa`;
}

// Function to get UV Index from coordinates
async function getUVIndex(lat, lon) {
    const uvResponse = await fetch(`${apiUrl}uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const uvData = await uvResponse.json();
    const uvIndex = uvData.value;
    uvIndexValue.textContent = uvIndex;
}

// Function to update 7-day forecast
function updateForecast(data) {
    forecastContainer.innerHTML = '';
    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { // Only take the forecast for each day (every 8th entry in the forecast)
            const dayForecast = document.createElement('div');
            dayForecast.classList.add('forecast-day');
            const forecastDay = new Date(forecast.dt * 1000).toLocaleString('en-US', { weekday: 'short' });
            const tempMin = forecast.main.temp_min;
            const tempMax = forecast.main.temp_max;
            dayForecast.innerHTML = `
                <div class="day">${forecastDay}</div>
                <div class="temp">${tempMin}°-${tempMax}°</div>
            `;
            forecastContainer.appendChild(dayForecast);
        }
    });
}

// Function to handle wind direction based on degree
function getWindDirection(deg) {
    if (deg >= 0 && deg <= 22.5) return 'N';
    if (deg > 22.5 && deg <= 67.5) return 'NE';
    if (deg > 67.5 && deg <= 112.5) return 'E';
    if (deg > 112.5 && deg <= 157.5) return 'SE';
    if (deg > 157.5 && deg <= 202.5) return 'S';
    if (deg > 202.5 && deg <= 247.5) return 'SW';
    if (deg > 247.5 && deg <= 292.5) return 'W';
    if (deg > 292.5 && deg <= 337.5) return 'NW';
    return 'N';
}

// Function to handle unit toggle (Celsius/Fahrenheit)
unitToggle1.addEventListener('click', () => {
    if (currentUnit !== 'metric') {
        currentUnit = 'metric'; // Celsius
        unitToggle1.style.backgroundColor = 'black';
        unitToggle1.style.color = 'white';
        unitToggle2.style.backgroundColor = 'white';
        unitToggle2.style.color = 'black';
        const city = cityInput.value;
        if (city) getWeatherData(city);
    }
});

unitToggle2.addEventListener('click', () => {
    if (currentUnit !== 'imperial') {
        currentUnit = 'imperial'; // Fahrenheit
        unitToggle2.style.backgroundColor = 'black';
        unitToggle2.style.color = 'white';
        unitToggle1.style.backgroundColor = 'white';
        unitToggle1.style.color = 'black';
        const city = cityInput.value;
        if (city) getWeatherData(city);
    }
});

// Handle search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);

    }

});
