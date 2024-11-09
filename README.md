# Weather-App

64f60853740a1ee3ba20d0fb595c97d5











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
        fetchForecast(data.coord.lat, data.coord.lon, apiKey); // Fetch forecast using latitude and longitude
    } catch (error) {
        console.error(error);
    }
}


async function fetchForecast(lat, lon, key) {
    const cnt = 7;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&cnt=7&appid=${key}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch forecast data");
        }

        const forecastData = await response.json();

        // Assuming the UV index is available in the current weather API response
        const uvIndex = forecastData.list[0].uvi; // UV index from the first forecast entry

        updateForecastUI(forecastData.list);  // Update forecast UI
        updateUVIndex(uvIndex);               // Update UV index UI
    } catch (error) {
        console.error(error);
    }
}



const searchForm = document.querySelector('.search-form');
const cityInput = document.querySelector('.city-input');
const cityImage = document.getElementById('city-image');

// Replace with your Unsplash API key
const unsplashAccessKey = 'XLLahNoy3F5zq8w3Z71Euh1Vgfbd-GgU4MI4ueR1Wa0';

searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from submitting the usual way
    const city = cityInput.value.trim(); // Get the city name
    if (city) {
        fetchFamousPlaceImage(city); // Fetch image of a famous place
    }
});

// function fetchFamousPlaceImage(city) {
//     // Query with landmark or famous place keywords
//     fetch(`https://api.unsplash.com/search/photos?query=${city}+landmark,famous+place&client_id=${unsplashAccessKey}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.results.length > 0) {
//                 // Get the first image result and set it as the src of the img tag
//                 cityImage.src = data.results[0].urls.regular;
//                 cityImage.alt = `${city} Famous Place Image`;
//                 cityImage.style.display = 'block'; // Show the image
//             } else {
//                 cityImage.style.display = 'none'; // Hide image if no results
//                 alert('No famous place image found for this location.');
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching image:', error);
//             alert('Failed to fetch famous place image.');
//         });
// }



// Function to update UV index and risk level
function updateUVIndex(uvIndex) {
    const uvIndexElement = document.querySelector('.uv-index-value');
    const uvRiskLabel = document.querySelector('.uv-risk-label');

    const additionalUVIndexElement = document.querySelector('.additional-info .uv-index-value');
    const additionalUVRiskLabel = document.querySelector('.additional-info .uv-label');

    // Update the UV index value and risk label
    uvIndexElement.textContent = uvIndex;
    additionalUVIndexElement.textContent = uvIndex;

    const uvRisk = getUVRiskLevel(uvIndex);
    uvRiskLabel.textContent = uvRisk;
    additionalUVRiskLabel.textContent = uvRisk;

    // Update the UV Circle based on UV index
    updateUVCircle(uvIndex);

}

// Function to determine the UV risk level based on the UV index
function getUVRiskLevel(uvIndex) {
    if (uvIndex < 3) return 'Low';
    if (uvIndex < 6) return 'Moderate';
    if (uvIndex < 8) return 'High';
    if (uvIndex < 11) return 'Very High';
    return 'Extreme';
}
function updateUVCircle(uvIndex) {
    const uvCircle = document.querySelector('.uv-circle');

    if (!uvCircle) {
        console.error("UV Circle element not found!");
        return;
    }

    const uvAngle = Math.min((uvIndex / 11) * 180, 180);
    uvCircle.style.transform = `rotate(${uvAngle}deg)`;
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







    // Generate the HTML content dynamically
    const weatherHTML = `
            <div class="city">${data.name}</div>
            <div class="temperature">
                <span class="temperature-value">${Math.round(currentTemperature)}</span>
                <span class="temp-unit">°${isCelsius ? 'C' : 'F'}</span>
            </div>
            <div class="description">
                <i class="material-icons">${getWeatherIconName(data.weather[0].main)}</i>
                <span class="description-text">${data.weather[0].description}</span>
            </div>
            <div class="additional-info">
                <div class="wind">
                    Wind Speed: <span class="wind-speed">${Math.round(currentWindSpeed)}</span> <span class="wind-label">${isCelsius ? 'm/s' : 'mph'}</span>
                </div>
                <div class="humidity">Humidity: ${data.main.humidity}%</div>
                <div class="visibility">Visibility: <span class="visibility-distance">${(currentVisibility / 1000).toFixed(1)}</span> <span class="visibility-label">${isCelsius ? 'km' : 'miles'}</span></div>
                <div class="pressure">Pressure: <span class="pressure-value">${currentPressure}</span> hPa</div>
            </div>
            <div class="sunrise-sunset">
                <div class="sunrise">
                    <i class="material-icons">wb_sunny</i> Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="sunset">
                    <i class="material-icons">nights_stay</i> Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div class="date">${new Date().toDateString()}</div>
        `;
















    // New elements for sunrise and sunset in both main and additional info section
    const sunriseElement = document.querySelector(".sunrise-time");
    const sunsetElement = document.querySelector(".sunset-time");
    const sunriseIcon = document.querySelector(".sunrise-icon");
    const sunsetIcon = document.querySelector(".sunset-icon");

    // Additional info card for sunrise and sunset
    const additionalSunriseElement = document.querySelector(".additional-info .sunrise-time");
    const additionalSunsetElement = document.querySelector(".additional-info .sunset-time");

    // Update current variables with new data
    currentVisibility = data.visibility; // Update visibility with new data
    currentPressure = data.main.pressure; // Update pressure with new data
    currentTemperature = data.main.temp;

    // Update the UI elements with the new data
    cityElement.textContent = data.name;
    updateTemperatureDisplay();
    updateWindDisplay();
    updateVisibilityDisplay(); // Update visibility with the newly fetched data

    humidityElement.textContent = `${data.main.humidity}%`;
    pressureElement.textContent = `${currentPressure} hPa`;
    descriptionText.textContent = data.weather[0].description;

    // Format and display sunrise and sunset times
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update both the main weather card and additional info card
    sunriseElement.textContent = `Sunrise: ${sunriseTime}`;
    sunsetElement.textContent = `Sunset: ${sunsetTime}`;
    additionalSunriseElement.textContent = `Sunrise: ${sunriseTime}`;
    additionalSunsetElement.textContent = `Sunset: ${sunsetTime}`;

    // Set icons for sunrise and sunset in both cards
    sunriseIcon.innerHTML = `<i class="material-icons">wb_sunny</i>`;
    sunsetIcon.innerHTML = `<i class="material-icons">nights_stay</i>`;

    const currentDate = new Date();
    dateElement.textContent = currentDate.toDateString();
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    const descriptionIcon = document.querySelector(".description i");
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}


function updateForecastUI(daily) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ''; // Clear previous data

    const today = new Date().getDay(); // Current day index
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    daily.forEach((day, index) => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("forecast-day");

        const dayIndex = (today + index) % 7;
        const dayName = daysOfWeek[dayIndex]; // Get correct weekday name
        const temperature = `${Math.round(day.main.temp)}°C`; // Use daily temperature

        dayElement.innerHTML = `
            <div>${dayName}</div>
            <div>
                <i class="material-icons">${getWeatherIconName(day.weather[0].main)}</i>
            </div>
            ${temperature}
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
    const dropdownElement = document.querySelector(".city-list");
    const city = inputElement.value || (dropdownElement ? dropdownElement.value : "");

    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = "";
        if (dropdownElement) {
            dropdownElement.value = "";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".city-list");
    const inputElement = document.querySelector(".city-input");

    if (dropdown && inputElement) {
        dropdown.addEventListener("change", function () {
            inputElement.value = this.value;
        });
    }
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
        Sunrise: "wb_sunny",
        Sunset: "nights_stay"
    };

    return iconMap[weatherCondition] || "help";
}



/////////////////////////////////////////////////////////////////////////////////
// Constants for DOM elements
const cityInput = document.querySelector('.city-input');
const searchForm = document.querySelector('.search-form');
const temperatureValue = document.querySelector('.temperature-value');
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

// Initialize with a default city (optional)
getWeatherData('');
