const apiKey = '559e98cfd4fc4362e5b58c46ae508eae'; // Replace with your OpenWeatherMap API key
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherContainer = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecast');
const searchHistory = document.getElementById('searchHistory');

const loggedCities = new Set();

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        cityInput.value = '';
    }
});

// Event delegation for click events on search history list
searchHistory.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayCurrentWeather(data);
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`);
        })
        .then(response => response.json())
        .then(data => {
            const dailyData = data.daily;
            displayForecast(dailyData);
            updateSearchHistory(city);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayCurrentWeather(data) {
    const weatherIconClass = `wi wi-owm-${data.weather[0].id}`;
    const sunEmoji = '☀️'; // Sun emoji
    const currentTime = new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    currentWeatherContainer.innerHTML = `
        <h2>${data.name} ${sunEmoji}</h2>
        <p>${currentDate} ${currentTime}</p> <!-- Current Date and Time -->
        <i class="${weatherIconClass}"></i> <!-- Weather Icon -->
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}



function displayForecast(dailyData) {
    forecastContainer.innerHTML = '<h2>5-Day Forecast:</h2><ul>';

    // Check if dailyData is a valid array with forecast data
    if (Array.isArray(dailyData) && dailyData.length > 0) {
        // Limit the forecast to the next 5 days
        const nextFiveDays = dailyData.slice(1, 6); // Exclude the current day (index 0) and include the next 5 days

        nextFiveDays.forEach(day => {
            const date = new Date(day.dt * 1000);
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            const dateString = date.toLocaleDateString(undefined, options);
            const weatherIconClass = `wi wi-owm-${day.weather[0].id}`;
            
            forecastContainer.innerHTML += `
                <li>
                    <strong>${dateString}</strong> 
                    <i class="${weatherIconClass}"></i> <!-- Weather Icon -->
                    : ${day.weather[0].description}, 
                    Temperature: ${day.temp.day}°C, 
                    Humidity: ${day.humidity}%
                </li>
            `;
        });
    } else {
        forecastContainer.innerHTML += '<li>No forecast data available</li>';
    }
    forecastContainer.innerHTML += '</ul>';
}



function updateSearchHistory(city) {
    if (!loggedCities.has(city)) {
        loggedCities.add(city);
        const cityItem = document.createElement('li');
        cityItem.textContent = city;
        cityItem.style.backgroundColor = 'lightgray'; // Set background color to light gray
        searchHistory.appendChild(cityItem);

        // Store search history in localStorage
        const searchHistoryArray = Array.from(loggedCities);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
    }
}

// Load search history from localStorage on page load
window.addEventListener('load', function() {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
        const searchHistoryArray = JSON.parse(storedSearchHistory);
        searchHistoryArray.forEach(city => {
            const cityItem = document.createElement('li');
            cityItem.textContent = city;
            cityItem.style.backgroundColor = 'lightgray'; // Set background color to light gray
            searchHistory.appendChild(cityItem);
            loggedCities.add(city);
        });
    }
});



