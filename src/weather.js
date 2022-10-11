export default class Weather {
    constructor(api_key) {
        this.apiKey = api_key;
        if (
            // check if weather data is stored in local storage
            localStorage.getItem('weather') && 
            Date.now() - localStorage.getItem('timestamp') < 600000
        ) {
            // if it is, display it
            const weatherData = JSON.parse(localStorage.getItem('weather'));
            this.displayWeather(weatherData);
            console.log('weather data from local storage');
        }
        else {
            // if not, get it from the API
            this.getLocation();
        }
    }
    
    getLocation() {
        if (navigator.geolocation) {
            // get the user's location
            navigator.geolocation.getCurrentPosition(this.getWeather.bind(this));
        } else {
            // if the user doesn't allow it, display a message in the console
            console.log("Geolocation is not supported by this browser.");
        }
    }

    getWeather(position) {
        // get the weather data from the API
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        // fetch the weather data from the API
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // store the weather data in local storage
            localStorage.setItem('weather', JSON.stringify(data));
            localStorage.setItem('timestamp', Date.now());
            this.displayWeather(data);
        });
    }	

    displayWeather(data) {
        // display the weather data
        const temp = data.current.temp_c;
        console.log(data.current);
        document.querySelector('.weather__temp').innerHTML = `${temp}°C`;

        const weather = data.current.condition.text;
        document.querySelector('.weather__summary').innerHTML = weather;

        const icon = data.current.condition.icon;
        console.log(icon);
        document.querySelector(".icon").src = icon;

        switch (true)
        {
            case (temp > 20):
            alert('gt');
            break;
            case (temp <= 20):
            alert('lt');
            break; 
        }
    }
}