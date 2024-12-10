let dict = {
    0: {icon: "clear-day", description: "晴"},
    1: {icon: "clear-day", description: "部分晴"},
    2: {icon: "partly-cloudy-day", description: "部分多云"},
    3: {icon: "overcast-day", description: "多云"},
    45: {icon: "fog", description: "雾"},
    48: {icon: "fog", description: "冻雾"},
    51: {icon: "drizzle", description: "小雨"},
    53: {icon: "drizzle", description: "中雨"},
    55: {icon: "rain", description: "大雨"},
    56: {icon: "sleet", description: "雨夹雪"},
    57: {icon: "sleet", description: "雨夹雪"},
    61: {icon: "drizzle", description: "小雨"},
    63: {icon: "drizzle", description: "中雨"},
    65: {icon: "rain", description: "大雨"},
    66: {icon: "sleet", description: "冻雨"},
    67: {icon: "sleet", description: "强冻雨"},
    71: {icon: "snow", description: "小雪"},
    73: {icon: "snow", description: "中雪"},
    75: {icon: "snow", description: "大雪"},
    77: {icon: "snow", description: "细雪"},
    80: {icon: "drizzle", description: "小阵雨"},
    81: {icon: "drizzle", description: "中阵雨"},
    82: {icon: "rain", description: "强阵雨"},
    85: {icon: "snow", description: "小阵雪"},
    86: {icon: "snow", description: "大阵雪"},
    95: {icon: "thunderstorms", description: "雷暴"},
    96: {icon: "thunderstorms-hail", description: "雷暴伴有小冰雹"},
    99: {icon: "thunderstorms-hail", description: "雷暴伴有大冰雹"},
};

let card = document.getElementById("weather-card");
let city = card.querySelector(".weather-city");
let temperature = card.querySelector(".weather-temperature");
let description = card.querySelector(".weather-description");
let icon = card.querySelector(".weather-icon");
let date = card.querySelector(".weather-date");
let region = card.querySelector(".weather-location");

if (card) {
    const now = new Date();
    date.innerHTML = `${now.getMonth() + 1}/${now.getDate()} - ${getWeekDay(now)}`;
    date.classList.remove("skeleton");

    // 检查缓存
    const cachedData = localStorage.getItem('weatherData');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (parsedData.timestamp && (Date.now() - parsedData.timestamp) < 600000) {
            updateUIFromCache(parsedData);
        } else {
            localStorage.removeItem('weatherData');
            fetchWeatherData();
        }
    } else {
        fetchWeatherData();
    }
}

function fetchWeatherData() {
    fetch(`https://api.qjqq.cn/api/Local`)
        .then(response => response.json())
        .then(data => {
            let _data = data.data;
            if(_data.city && _data.country && _data.lat && _data.lng) {
                city.innerHTML = _data.city;
                region.innerHTML = _data.country + ", " + _data.city;
                city.classList.remove("skeleton");
                region.classList.remove("skeleton");

                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${_data.lat}&longitude=${_data.lng}&current=apparent_temperature,weather_code`);
            }
            throw new Error("request ip location failed");
        })
        .then(response => response.json())
        .then(data => {
            let _current = data.current;
            let _units = data.current_units;

            if(_current && _units) {
                const cacheData = {
                    city: city.innerHTML,
                    region: region.innerHTML,
                    current: _current,
                    units: _units,
                    timestamp: Date.now()
                };
                localStorage.setItem('weatherData', JSON.stringify(cacheData));
                
                updateWeatherUI(_current, _units);
                temperature.classList.remove("skeleton");
                description.classList.remove("skeleton");
                icon.classList.remove("skeleton");
                return;
            }
            throw new Error("request weather failed");
        })
        .catch(error => console.error(error))
        .finally(() => {
            if(city.classList.contains("skeleton")) {
                city.innerHTML = "未知";
                city.classList.remove("skeleton");

                region.innerHTML = "无法获取";
                region.classList.remove("skeleton");
            }
            
            if(temperature.classList.contains("skeleton")) {
                temperature.innerHTML = "N/A℃";
                description.innerHTML = "N/A";              
                description.classList.remove("skeleton");
                temperature.classList.remove("skeleton");

                let iconImg = icon.querySelector("img");
                iconImg.src = iconImg.dataset.base + "not-available.svg";
                iconImg.classList.remove("hidden");
                icon.classList.remove("skeleton");
            }
        });
}

function updateWeatherUI(current, units) {
    temperature.innerHTML = current.apparent_temperature + units.apparent_temperature;
    
    let iconImg = icon.querySelector("img");
    let weather = dict[current.weather_code];
    if(weather) {
        description.innerHTML = weather.description;
        iconImg.src = iconImg.dataset.base + weather.icon + ".svg";
    } else {
        description.innerHTML = "N/A";
        iconImg.src = iconImg.dataset.base + "not-available.svg";
    }
    iconImg.classList.remove("hidden");
}

function getWeekDay(date) {
    let days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
}

function updateUIFromCache(cachedData) {
    city.innerHTML = cachedData.city;
    region.innerHTML = cachedData.region;
    city.classList.remove("skeleton");
    region.classList.remove("skeleton");

    updateWeatherUI(cachedData.current, cachedData.units);    
    temperature.classList.remove("skeleton");
    description.classList.remove("skeleton");
    icon.classList.remove("skeleton");
}