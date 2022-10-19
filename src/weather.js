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
        document.querySelector(".icon").src = icon;

        //choose a location based on the temperature and add a description
        switch (true)
        {   
            case (50 > temp >= 25):
                this.city = 'stockholm';
                this.description = "It's wayyy too hot outside, go visit a cooler place like sweden or something.";
            break;
            case (25 > temp >= 15):
                this.city = 'london';
                this.description = "Perfect weather for a trip to a cool place like the UK.";
            break; 
            case (15 > temp >= 0):
                this.city = 'bordeaux';
                this.description = "It's a bit chilly outside, go visit a warmer place like the south of france.";
            break; 
            case (0 > temp >= -15):
                this.city = 'madrid';
                this.description = "How are you not freezing to death?! Go warm up quickly in Spain.";
            break; 
        }
        // display the city and description
        fetch(`https://engine.hotellook.com/api/v2/lookup.json?query=${this.city}&lang=en&lookFor=both&limit=1&token=63e0db9455b4c4db38c8401e8a6ad8a0`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.querySelector('.hotel__description').innerHTML = this.description + " Here's a hotel in " + this.city + " we recommend: " + data.results.hotels[0].label;
            console.log(data.results.hotels[0].id);
            // display the hotel image
            document.querySelector('.hotel__img').src = `https://photo.hotellook.com/image_v2/limit/h${data.results.hotels[0].id}_1/800/520.auto`;
            console.log("image added");
        })
        .catch(err => console.error(err));
    }
}