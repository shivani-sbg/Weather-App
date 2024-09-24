

const apiKey = '64f60853740a1ee3ba20d0fb595c97d5'; // Replace with your OpenWeatherMap API key

let isCelsius = true;
let currentTemperature = 0;
let currentWindSpeed = 0;
let currentVisibility = 0;
let currentPressure = 0;

async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        currentTemperature = data.main.temp;
        currentWindSpeed = data.wind.speed;
        currentVisibility = data.visibility;
        currentPressure = data.main.pressure;

        updateWeatherUI(data);
        fetchForecast(data.coord.lat, data.coord.lon); // Fetch forecast using latitude and longitude
    } catch (error) {
        console.error(error);
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch forecast data");
        }
        const forecastData = await response.json();
        updateForecastUI(forecastData.daily);
    } catch (error) {
        console.error(error);
    }
}

function updateWeatherUI(data) {
    const cityElement = document.querySelector(".city");
    const temperatureElement = document.querySelector(".temperature-value");
    const unitElement = document.querySelector(".temp-unit");
    const windSpeedElement = document.querySelector(".wind-speed");
    const humidityElement = document.querySelector(".humidity");
    const visibilityElement = document.querySelector(".visibility-distance");
    const pressureElement = document.querySelector(".pressure-value");
    const descriptionText = document.querySelector(".description-text");
    const dateElement = document.querySelector(".date");

    cityElement.textContent = data.name;
    updateTemperatureDisplay();
    updateWindDisplay();
    updateVisibilityDisplay();
    humidityElement.textContent = `${data.main.humidity}%`;
    pressureElement.textContent = `${currentPressure} hPa`;
    descriptionText.textContent = data.weather[0].description;

    const currentDate = new Date();
    dateElement.textContent = currentDate.toDateString();
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    const descriptionIcon = document.querySelector(".description i");
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}

function updateForecastUI(daily) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ''; // Clear previous data

    daily.slice(1, 8).forEach(day => { // Skip the current day
        const dayElement = document.createElement("div");
        dayElement.classList.add("forecast-day");

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temperature = `${Math.round(day.temp.day)}°C`;
        const weatherIconName = getWeatherIconName(day.weather[0].main);

        dayElement.innerHTML = `
            <div>${dayName}</div>
            <div>${temperature}</div>
            <i class="material-icons">${weatherIconName}</i>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

function updateTemperatureDisplay() {
    const temperatureElement = document.querySelector(".temperature-value");
    const unitElement = document.querySelector(".temp-unit");
    const toggleButton = document.querySelector(".toggle-unit");

    if (isCelsius) {
        temperatureElement.textContent = `${Math.round(currentTemperature)}`;
        unitElement.textContent = 'C';
        toggleButton.textContent = 'Switch to °F';
    } else {
        const fahrenheitTemp = (currentTemperature * 9) / 5 + 32;
        temperatureElement.textContent = `${Math.round(fahrenheitTemp)}`;
        unitElement.textContent = 'F';
        toggleButton.textContent = 'Switch to °C';
    }
}

function updateWindDisplay() {
    const windSpeedElement = document.querySelector(".wind-speed");
    const windUnitElement = document.querySelector(".wind-label");

    if (isCelsius) {
        windSpeedElement.textContent = `${Math.round(currentWindSpeed)}`;
        windUnitElement.textContent = 'm/s';
    } else {
        const windSpeedMph = currentWindSpeed * 2.237;
        windSpeedElement.textContent = `${Math.round(windSpeedMph)}`;
        windUnitElement.textContent = 'mph';
    }
}

function updateVisibilityDisplay() {
    const visibilityElement = document.querySelector(".visibility-distance");
    const visibilityUnitElement = document.querySelector(".visibility-label");

    if (isCelsius) {
        visibilityElement.textContent = `${(currentVisibility / 1000).toFixed(1)}`;
        visibilityUnitElement.textContent = 'km';
    } else {
        const visibilityMiles = (currentVisibility / 1000) * 0.621371;
        visibilityElement.textContent = `${visibilityMiles.toFixed(1)}`;
        visibilityUnitElement.textContent = 'miles';
    }
}

document.querySelector(".toggle-unit").addEventListener("click", function () {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
    updateWindDisplay();
    updateVisibilityDisplay();
});

document.querySelector(".search-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputElement = document.querySelector(".city-input");
    const dropdownElement = document.querySelector(".city-dropdown");
    const city = inputElement.value || dropdownElement.value;

    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = "";
        dropdownElement.value = "";
    }
});

document.querySelector(".city-dropdown").addEventListener("change", function () {
    const inputElement = document.querySelector(".city-input");
    inputElement.value = this.value;
});

function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };

    return iconMap[weatherCondition] || "help";
}
