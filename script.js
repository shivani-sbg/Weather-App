


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
    const cnt = 7
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&cnt=7&appid=${key}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch forecast data");
        }
        const forecastData = await response.json();

        // const uvIndex = forecastData.daily[0].uvi; // Get UV index for the current day

        updateForecastUI(forecastData.list);
        // updateUVIndex(uvIndex); // Call function to update UV index gauge
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

function fetchFamousPlaceImage(city) {
    // Query with landmark or famous place keywords
    fetch(`https://api.unsplash.com/search/photos?query=${city}+landmark,famous+place&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                // Get the first image result and set it as the src of the img tag
                cityImage.src = data.results[0].urls.regular;
                cityImage.alt = `${city} Famous Place Image`;
                cityImage.style.display = 'block'; // Show the image
            } else {
                cityImage.style.display = 'none'; // Hide image if no results
                alert('No famous place image found for this location.');
            }
        })
        .catch(error => {
            console.error('Error fetching image:', error);
            alert('Failed to fetch famous place image.');
        });
}



function updateUVIndex(uvIndex) {
    const uvIndexElement = document.querySelector('.uv-index-value');
    const uvRiskLabel = document.querySelector('.uv-risk-label');

    const additionalUVIndexElement = document.querySelector('.additional-info .uv-index-value');
    const additionalUVRiskLabel = document.querySelector('.additional-info .uv-label');

    uvIndexElement.textContent = uvIndex;
    additionalUVIndexElement.textContent = uvIndex;
    const uvRisk = getUVRiskLevel(uvIndex);
    uvRiskLabel.textContent = uvRisk;
    additionalUVRiskLabel.textContent = uvRisk;
    updateUVCircle(uvIndex); // Update the semi-circle gauge based on UV index
}

function getUVRiskLevel(uvIndex) {
    if (uvIndex < 3) return 'Low';
    if (uvIndex < 6) return 'Moderate';
    if (uvIndex < 8) return 'High';
    if (uvIndex < 11) return 'Very High';
    return 'Extreme';
}
// Update the semi-circle UV gauge based on the index value
function updateUVCircle(uvIndex) {
    const uvCircle = document.querySelector('.uv-circle');
    const uvAngle = Math.min((uvIndex / 11) * 180, 180); // Calculate angle, max 180 degrees
    uvCircle.style.transform = `rotate(${uvAngle}deg)`; // Rotate semi-circle based on UV index
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

    // New elements for sunrise and sunset in both main and additional info section
    const sunriseElement = document.querySelector(".sunrise-time");
    const sunsetElement = document.querySelector(".sunset-time");
    const sunriseIcon = document.querySelector(".sunrise-icon");
    const sunsetIcon = document.querySelector(".sunset-icon");

    // Additional info card for sunrise and sunset
    const additionalSunriseElement = document.querySelector(".additional-info .sunrise-time");
    const additionalSunsetElement = document.querySelector(".additional-info .sunset-time");

    cityElement.textContent = data.name;
    updateTemperatureDisplay();
    updateWindDisplay();
    updateVisibilityDisplay();
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



// function updateForecastUI(daily) {
//     console.log(daily, "daalll");

//     const forecastContainer = document.querySelector(".forecast-container");
//     forecastContainer.innerHTML = ''; // Clear previous data

//     daily.forEach(day => { // Skip the current day
//         console.log(day, "temmm");
//         const dayElement = document.createElement("div");
//         dayElement.classList.add("forecast-day");

//         const date = new Date(day.dt_txt * 1000);
//         const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//         const dayName = daysOfWeek[date.getDay()];
//         const weatherIconName = getWeatherIconName(day.weather[0].main);
//         const temperature = `${Math.round(day.main.temp)}°C`;

//         dayElement.innerHTML = `
//          <div>${dayName}</div>
//          <div>
//          <i class="material-icons">${weatherIconName}</i>
//          </div> ${temperature}
//         `;

//         forecastContainer.appendChild(dayElement);
//     });
// }

function updateForecastUI(daily) {
    console.log(daily, "daily data");

    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ''; // Clear previous data

    // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay(); // Current day index
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    daily.forEach((day, index) => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("forecast-day");

        // Calculate the day of the week for each forecast entry
        const dayIndex = (today + index) % 7; // Move through days of the week dynamically
        const dayName = daysOfWeek[dayIndex]; // Get the correct weekday name

        const weatherIconName = getWeatherIconName(day.weather[0].main); // Get icon based on weather condition
        const temperature = `${Math.round(day.main.temp)}°C`; // Use daily temperature

        // Render the day name, icon, and temperature
        dayElement.innerHTML = `
            <div>${dayName}</div>
            <div>
                <i class="material-icons">${weatherIconName}</i>
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
    const city = inputElement.value || dropdownElement.value;

    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = "";
        dropdownElement.value = "";
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





