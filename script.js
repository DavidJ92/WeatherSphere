document.addEventListener("DOMContentLoaded", function() {
    var apiKey = "559e98cfd4fc4362e5b58c46ae508eae";
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";
    var searchInput = document.getElementById("cityname");
    var daysContainer = document.getElementById("five-day-containers");
    var historyList = document.getElementById("history-list");
    var searchHistory = [];
    
    // Load search history from local storage if available
    if (localStorage.getItem("searchHistory")) {
        searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        renderSearchHistory();
    }
    
    $("#search-btn").on("click", function () {
        if (searchInput.value == "") {
            alert("Please enter city name.");
        } else {
            var cityName = searchInput.value;
            searchHistory.push(cityName);
            // Save updated search history to local storage
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            renderSearchHistory();
            fetchWeather(cityName);
        }
    });
    
    function renderSearchHistory() {
        // Clear the history list before rendering
        historyList.innerHTML = "";
        searchHistory.forEach(city => {
            var listItem = document.createElement("li");
            listItem.textContent = city;
            listItem.addEventListener("click", function() {
                fetchWeather(city);
            });
            historyList.appendChild(listItem);
        });
    }


function fetchWeather(city) {
    fetch(apiUrl + city + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => {
            // Extract necessary data from the API response
            var currentWeather = data.list[0];
            var forecast = data.list.slice(1, 6); // Get the next 5-day forecast

            // Update current weather UI
            document.querySelector('.city').textContent = city;
            document.querySelector('.date').textContent = dayjs(currentWeather.dt_txt).format("ddd MMMM D, YYYY");
            document.querySelector('.temperature').textContent = "Temperature: " + Math.round(currentWeather.main.temp) + "°F";
            document.querySelector('.description').textContent = "Description: " + currentWeather.weather[0].description;
            document.querySelector('.wind').textContent = "Wind: " + Math.round(currentWeather.wind.speed) + "Mph";
            document.querySelector('.humidity').textContent = "Humidity: " + currentWeather.main.humidity + "%";

            // Update current weather icon
            var weatherIcon = getWeatherIcon(currentWeather.weather[0].main);
            document.querySelector('.weathericon').setAttribute("src", weatherIcon);

            // Update 5-day forecast UI
            daysContainer.innerHTML = "";
            forecast.forEach(day => {
                var dayContainer = document.createElement("div");
                dayContainer.className = "days";
                dayContainer.innerHTML = `
                    <div class="icon">
                        <img src="${getWeatherIcon(day.weather[0].main)}" class="weathericon" alt="weather-icon">
                    </div>
                    <h2 class="city">${city}</h2>
                    <h3 class="date">${dayjs(day.dt_txt).format("ddd MMMM D, YYYY")}</h3>
                    <br>
                    <h4 class="temperature">Temperature: ${Math.round(day.main.temp)}°F</h4>
                    <h4 class="description">Description: ${day.weather[0].description}</h4>
                    <h4 class="wind">Wind: ${Math.round(day.wind.speed)}Mph</h4>
                    <h4 class="humidity">Humidity: ${day.main.humidity}%</h4>
                `;
                daysContainer.appendChild(dayContainer);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}



function getWeatherIcon(weatherType) {
    switch (weatherType) {
        case "Sunny":
            return "./assets/images/sunny_icon.png";
        case "Clouds":
            return "./assets/images/clouds_icon.png";
        case "Rain":
            return "./assets/images/rain_icon.png";
        case "Thunderstorm":
            return "./assets/images/thunderstorm_icon.png";
        case "Drizzle":
            return "./assets/images/drizzle_icon.png";
        case "Mist":
            return "./assets/images/mist_icon.png";
        case "Haze":
            return "./assets/images/haze_icon.png";
        case "Fog":
            return "./assets/images/fog_icon.png";
        case "Snow":
            return "./assets/images/snow_icon.png";
        default:
            return "./assets/images/sunny_icon.png";
    }
}

function renderSearchHistory() {
    // Clear the history list before rendering
    historyList.innerHTML = "";
    searchHistory.forEach(city => {
        var listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", function() {
            fetchWeather(city);
        });
        historyList.appendChild(listItem);
    });
}
});

