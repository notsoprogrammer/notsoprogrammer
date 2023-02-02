let units = 'imperial';
let searchMethod = 'zip';
let appid='fb7348db5dc2736e5abcfcbfdf031769';

//searchcity
function getSearchMethod(searchTerm){
    if (searchTerm.length === 5 && Number.parseInt(searchTerm)+ '' ===searchTerm) //
        searchMethod='zip';
    else
        searchMethod = 'q';
}
function searchWeather(searchTerm){
    getSearchMethod(searchTerm);
    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appid}&units=${units}`).then(result =>{
        return result.json();
    }).then(result => {
        init(result);
    })
}
function init(resultFromServer){    //json
    switch(resultFromServer.weather[0].main) {

    case 'Clear':
        document.body.style.backgroundImage = "url('clear.jpeg')";
        break;
        
    case 'Rain':
        document.body.style.backgroundImage = "url('rainy.jpeg')";
        break;
    case 'Drizzle':
        document.body.style.backgroundImage = "url('rain.jpeg')";
        break;
    case 'Mist':
        document.body.style.backgroundImage = "url('rain.jpeg')";
        break;
        
    case 'Thunderstorm':
        document.body.style.backgroundImage = "url('thunderstorm.jpeg')";
            break;
    case 'Snow':
        document.body.style.backgroundImage = "url('snow.jpeg')";
        break;
      default:
          break;
     
    }
    let weatherDescriptionHeader= document.getElementById('weatherDescriptionHeader');
    let temperatureElement= document.getElementById('temperature');
    let humidityElement= document.getElementById('humidity');
    let windSpeedElement= document.getElementById('windSpeed');
    let cityHeader= document.getElementById('cityHeader');
    let weatherIcon=document.getElementById('documentIconImg');
  
    weatherIcon.src='http://openweathermap.org/img/w/'+ resultFromServer.weather[0].icon+'.png';
    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerText= resultDescription.charAt(0).toUpperCase()+resultDescription.slice(1);
    temperatureElement.innerHTML= Math.floor(resultFromServer.main.temp)+ '&#176';
    windSpeedElement.innerHTML='Winds at ' + Math.floor(resultFromServer.wind.speed) + ' m/s';
    cityHeader.innerHTML= resultFromServer.name;
    humidityElement.innerHTML='Humidity levels at ' + resultFromServer.main.humidity + ' %';
    
    setPositionForWeatherInfo();
}
function setPositionForWeatherInfo() {
    let weatherContainer= document.getElementById('weatherContainer');
    let weatherContainerHeight= weatherContainer.clientHeight;
    let weatherContainerWidth= weatherContainer.clientWidth;

    weatherContainer.style.left= `calc(50%-${weatherContainerWidth/2}px)`;
    weatherContainer.style.top= `calc(50%- ${weatherContainerHeight/1.3}px)`;
    weatherContainer.style.visibility='visible';
}

    document.getElementById('searchBtn').addEventListener('click',()=>{
        let searchTerm=document.getElementById('searchInput').value;
        if(searchTerm)
        searchWeather(searchTerm);
    })


const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='fb7348db5dc2736e5abcfcbfdf031769';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}