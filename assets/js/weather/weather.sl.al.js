let card = document.getElementById("weather-card");
let dict = {
    "晴": "clear-day",
    "多云": "cloudy",
    "阴": "overcast",
    "阵雨": "rain",
    "雷阵雨": "thunderstorms-rain",
    "雷阵雨伴有冰雹": "thunderstorms-rain",
    "雨夹雪": "sleet",
    "小雨": "drizzle",
    "中雨": "rain",
    "大雨": "rain",
    "暴雨": "rain",
    "大暴雨": "rain",
    "特大暴雨": "rain",
    "阵雪": "snow",
    "小雪": "snow",
    "中雪": "snow",
    "大雪": "snow",
    "暴雪": "snow",
    "雾": "fog",
    "冻雨": "sleet",
    "沙尘暴": "dust-wind",
    "小到中雨": "rain",
    "中到大雨": "rain",
    "大到暴雨": "rain",
    "暴雨到大暴雨": "rain",
    "大暴雨到特大暴雨": "rain",
    "小到中雪": "snow",
    "中到大雪": "snow",
    "大到暴雪": "snow",
    "浮尘": "dust-wind",
    "扬沙": "dust-wind",
    "雨": "rain",
    "雪": "snow",
    "冰雹": "hail",
    "霾": "haze",
};

if (card) {
    let params = '';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                params = `&lat=${lat}&lon=${lon}`;
                console.log("lat", lat, "lon", lon);
            }
        );
    }

    let city = card.querySelector(".weather-city");
    let temperature = card.querySelector(".weather-temperature");
    let condition = card.querySelector(".weather-description");
    let icon = card.querySelector(".weather-icon");
    let date = card.querySelector(".weather-date");
    let location = card.querySelector(".weather-location");

    fetch(`https://weather.sl.al/?lang=zh${params}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let _location = data.location;
            let _current = data.current;

            city.innerHTML = _location.city;
            city.classList.remove("skeleton");

            temperature.innerHTML = _current.temperature + "℃";
            temperature.classList.remove("skeleton");

            condition.innerHTML = _current.description;
            condition.classList.remove("skeleton");

            let iconImg = icon.querySelector("img");
            iconImg.src = iconImg.dataset.base + dict[_current.description] + ".svg";
            iconImg.classList.remove("hidden");
            icon.classList.remove("skeleton");

            const now = new Date();
            date.innerHTML = `${now.getMonth() + 1}/${now.getDate()} - ${getWeekDay(now)}`;
            date.classList.remove("skeleton");

            location.innerHTML = _location.city + ", " + _location.region;
            location.classList.remove("skeleton");
        })
        .catch(error => {
            console.error('weather request failed', error);
            city.innerHTML = "未知";
            city.classList.remove("skeleton");

            temperature.innerHTML = "N/A" + "℃";
            temperature.classList.remove("skeleton");

            condition.innerHTML = "N/A";
            condition.classList.remove("skeleton");

            let iconImg = icon.querySelector("img");
            iconImg.src = iconImg.dataset.base + "not-available.svg";
            iconImg.classList.remove("hidden");
            icon.classList.remove("skeleton");

            const now = new Date();
            date.innerHTML = `${now.getMonth() + 1}/${now.getDate()} - ${getWeekDay(now)}`;
            date.classList.remove("skeleton");

            location.innerHTML = "无法获取";
            location.classList.remove("skeleton");
        });
}

function getWeekDay(date) {
    let days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
}