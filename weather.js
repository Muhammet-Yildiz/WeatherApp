//Element Seçme 


const searchSvg = document.querySelector(".searchSvg")

const searchInput = document.querySelector(".searchInput")
const form = document.querySelector("form")

const searchLocation = document.querySelector(".location h2")

const date = document.querySelector(".datetime p")

// img yerlestırılecek
const mainweatherIcon = document.querySelector(".weatherIcon  ")
const mainTemprature = document.querySelector(".temprature h1")
const mainDescription = document.querySelector(".description")


const mainHightDegree = document.querySelector(".hightDegree h6")

const mainWind = document.querySelector(".Wind h6")

const mainSunrise = document.querySelector(".Sunrise h6")

const mainLowDegree = document.querySelector(".lowDegree h6")

const mainRainRate = document.querySelector(".RainRate h6")

const mainSunset = document.querySelector(".Sunset h6")


const Forecast_Emp = document.querySelector(".Forecast_Emp")

const alertDanger = document.querySelector(".alertDanger")




const apikey = "18c6bb98bc7058e8f5bbc335544fff94"

const APIURL = (location) => `
https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apikey}&lang=TR

`

async function getWeathertoLocation(location) {

    try {
        const resp = await fetch(APIURL(location))
        const respData = await resp.json();
        showWeatherToUI(respData)

    } catch {
        alertDanger.style.display = "flex"

        setTimeout(() => {
            alertDanger.style.display = "none"

        }, 4000)

    }



}

addEventListeners()


function addEventListeners() {
    searchSvg.addEventListener("click", locationSearch)
    form.addEventListener("submit", locationSearch)

    document.addEventListener("DOMContentLoaded", getWeathertoLocation("istanbul"))

}



function locationSearch(e) {
    e.preventDefault();
    let InputValue = searchInput.value


    getWeathertoLocation(InputValue)

}

function showWeatherToUI(responseData) {


    let name = responseData.city.name
    let country = responseData.city.country

    searchLocation.innerHTML = `${name} , ${country}`

    let timestamp = responseData.list[0].dt

    let datetime = epochToDatetime(timestamp)

    date.innerHTML = datetime


    let temprature = responseData.list[1].main.temp
    let description = responseData.list[1].weather[0].description
    let weatherIcon = responseData.list[1].weather[0].icon


    mainTemprature.innerHTML = `${parseInt( KtoC(temprature))}°`
    mainDescription.innerHTML = `${description}`


    mainweatherIcon.innerHTML = `
    <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" >
    `;



    let hightDegree = responseData.list[1].main.temp_max
    let lowDegree = responseData.list[1].main.temp_min

    try {
        RainRate = responseData.list[1].rain["3h"]

    } catch {
        RainRate = 0
    }

    let Wind = responseData.list[1].wind.speed

    let Sunrise = responseData.city.sunrise

    let Sunset = responseData.city.sunset

    mainHightDegree.innerHTML = `${KtoC( hightDegree)}°`

    mainLowDegree.innerHTML = `${ KtoC( lowDegree)}°`

    mainRainRate.innerHTML = `${parseInt( RainRate*100)}%`

    mainWind.innerHTML = `${Wind}mph`


    mainSunrise.innerHTML = `${getHourFromEpoch(Sunrise)}`

    mainSunset.innerHTML = `${getHourFromEpoch(Sunset)}`


    createForecast(responseData);



}




function epochToDatetime(timestamp) {

    let Mymonths = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Agustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    let Mydays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]


    let datetime = new Date(timestamp * 1000)

    let daynumber = datetime.getDate()
    let month = datetime.getMonth()
    let day = datetime.getDay()


    return `${Mydays[day]} ${daynumber} ${Mymonths[month]}`

}

// kelvin to celcius
function KtoC(K) {
    return (K - 273.15).toFixed(1)

}

function getHourFromEpoch(timestamp) {


    let datetime = new Date(timestamp * 1000);

    let hour = datetime.getHours()
    let minute = datetime.getMinutes()


    if (minute.toString().length == 1) {
        return `${hour}:${minute}0`

    } else {
        return `${hour}:${minute}`

    }

}


function createForecast(responseData) {

    Forecast_Emp.innerHTML = "";
    for (let i = 0; i < 40; i++) {


        let date = getDateFromEpoch(responseData.list[i].dt)

        let hour = getHourFromEpoch(responseData.list[i].dt)

        let weatherIcon = responseData.list[i].weather[0].icon


        let temprature = parseInt(KtoC(responseData.list[i].main.temp))
        let item = document.createElement("div")

        item.className = "Disclosure_Item"


        item.innerHTML = `

        <div class="Date">
           ${date}
        </div>
        <div class="Hour">
            ${hour}
        </div>

        <div class="WeatherIcon">
            <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="photo ">
        </div>

        <div class="Temprature">
            ${temprature}°
        </div>
        
        `;

        Forecast_Emp.appendChild(item)


    }


}

function getDateFromEpoch(timestamp) {

    let datetime = new Date(timestamp * 1000);

    let day = datetime.getDate();

    let month = datetime.getMonth()
    if (month.toString().length == 1) {
        return `${day}.0${month+1}`
    } else {

        return `${day}.${month+1}`
    }


}