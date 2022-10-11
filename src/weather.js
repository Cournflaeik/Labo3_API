export default class Weather {
    constructor(api_key) {
        this.apiKey = api_key;
        if (
            localStorage.getItem('weather') && 
            Date.now() - localStorage.getItem('timestamp') < 600000
        ) {
            const weatherData = JSON.parse(localStorage.getItem('weather'));
            this.displayWeather(weatherData);
            console.log('weather data from local storage');
        }
        else {
        this.getLocation();
        }
    }
    
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    getWeather(position) {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('weather', JSON.stringify(data));
            localStorage.setItem('timestamp', Date.now());
            this.displayWeather(data);
        });
    }	

    displayWeather(data) {
        const temp = data.current.temp_c;
        document.querySelector('.weather__temp').innerHTML = temp + '°C';

        const weather = data.current.condition.text;
        document.querySelector('.weather__summary').innerHTML = weather;

        const icon = data.current.condition.icon;
        const img = document.createElement('img');
        img.src = icon;
        document.querySelector('.weather__icon').appendChild(img);
    }
}