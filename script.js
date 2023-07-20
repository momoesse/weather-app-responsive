const sApiKey = ""; /* YOUR KEY GOES HERE */

function setMenuDisplay() {
    var oCheckboxToggle = document.getElementById("checkboxToggle");
    var aButtonArea = document.getElementsByClassName("displayBar");

    for (var i = 0; i < aButtonArea.length; i++) {
        if (oCheckboxToggle.checked === true) {
            aButtonArea[i].style.display = "none";
        } else {
            aButtonArea[i].style.display = "flex";
        }
    }
}

function getDate() {
    const dDate = new Date();
    dDate.getFullYear();
    dDate.getMonth();
    dDate.getDate();
    dDate.getDay();
}

function fetchWeather(sCityName) {
    if (!sCityName) {
        var sCityName = document.getElementById("idSearchInput").value;
    }

    /*
    var sUnits;
    if (celsius) {
        sUnits = metric;
    } else {
        sUnits = imperial;
    }
    */

    //var sUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + sCityName + "&units=metric&appid=" + sApiKey;

    let sUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + sCityName +
        "&units=metric&appid=" + sApiKey;

    fetch(sUrl).then((response) => {
        return response.json();
    }).then((data) => displayWeather(data));
}

function displayWeather(data) {
    const {
        name
    } = data;
    const {
        description,
        icon
    } = data.weather[0];
    const {
        humidity,
        temp,
        feels_like,
        temp_min,
        temp_max
    } = data.main;
    const {
        speed
    } = data.wind;
    const {
        country
    } = data.sys;

    document.querySelector(".city").innerText = name + ", " + country;
    document.querySelector(".icon").src = "https://openweathermap.org/img/w/" + icon + ".png";
    document.querySelector(".temperature").innerText = Math.round(temp) + "°";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = humidity + "%";
    document.querySelector(".windSpeed").innerText = speed + " km/h";
    document.querySelector(".feltTemperature").innerText = Math.round(feels_like) + "°";
    document.querySelector(".minTemperature").innerText = Math.round(temp_min) + "°";
    document.querySelector(".maxTemperature").innerText = Math.round(temp_max) + "°";

    const iTimezoneShift = data.timezone; //Shift in seconds from UTC
    const oToday = new Date();
    const oHourUTC = oToday.getUTCHours();
    let oMinutesUTC = oToday.getUTCMinutes().toString();
    let sDay = oToday.getDay()
    if (oMinutesUTC.length == 1) {
        oMinutesUTC = "0" + oMinutesUTC;
    }
    let sCurrentCityTime = oHourUTC + (iTimezoneShift / 3600) + ":" + oMinutesUTC;
    //document.querySelector(".currentTime").innerText = sCurrentCityTime;
    let sCurrentCityDate = oToday.getUTCDate().toString() + " " + (oToday.getUTCMonth() + 1).toString() + " " + oToday.getUTCFullYear().toString();
    //document.querySelector(".currentDate").innerText = sCurrentCityDate;

    switch (sDay) {
        case 0:
            sDay = "Sunday";
            break;
        case 1:
            sDay = "Monday";
            break;
        case 2:
            sDay = "Tuesday";
            break;
        case 3:
            sDay = "Wednesday";
            break;
        case 4:
            sDay = "Thursday";
            break;
        case 5:
            sDay = "Friday";
            break;
        default:
            sDay = "Saturday";
    }

    document.querySelector(".today").innerText = sDay + ", " + sCurrentCityDate;

    this.oState = {
        temp: Math.round(temp),
        feels_like: Math.round(feels_like),
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        isCelsius: true,
        isFahrenheit: false
    }

    document.getElementById("idBtnC").disabled = true;
    document.getElementById("idBtnC").style.opacity = 0.3;
    document.getElementById("idBtnF").disabled = false;
    document.getElementById("idBtnF").style.opacity = 1;
}

document.getElementById("idSearchInput").addEventListener("keyup", function (oEvent) {
    if (oEvent.key == "Enter") {
        fetchWeather();
    }
})

document.querySelector(".searchBar button").addEventListener("click", function () {
    fetchWeather();
});

document.querySelector(".geolocateButton").addEventListener("click", function () {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    let sLatitude = position.coords.latitude,
        sLongitude = position.coords.longitude;

    // "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
    let sUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + sLatitude + "&lon=" + sLongitude + "&units=metric&appid=" + sApiKey;

    fetch(sUrl).then((response) => {
        return response.json();
    }).then((data) => displayWeather(data));
}

function convertTemp(sParam) {
    let oData = this.oState;

    for (let k in oData) {
        if (typeof oData[k] == "number") {
            if (sParam == "C") {
                // formula --> °C = (°F - 32) ÷ 1.8
                let sValue = oData[k];
                let sTempC = (sValue - 32) / 1.8;
                oData[k] = sTempC;
            } else {
                // formula --> °F = (°C x 1.8) + 32
                let sValue = oData[k];
                let sTempC = (sValue * 1.8) + 32;
                oData[k] = sTempC;
            }
        }

        oData[k] = Math.round(oData[k]);

        switch (k) {
            case "temp":
                document.querySelector(".temperature").innerText = oData[k] + "°";
                break;
            case "feels_like":
                document.querySelector(".feltTemperature").innerText = oData[k] + "°";
                break;
            case "temp_min":
                document.querySelector(".minTemperature").innerText = oData[k] + "°";
                break;
            case "temp_max":
                document.querySelector(".maxTemperature").innerText = oData[k] + "°";
        }
    }

    if (sParam == "C") {
        document.getElementById("idBtnC").disabled = true;
        document.getElementById("idBtnC").style.opacity = 0.3;
        document.getElementById("idBtnF").disabled = false;
        document.getElementById("idBtnF").style.opacity = 1;
        this.oState.isCelsius = true;
        this.oState.isFahrenheit = false;
    } else {
        document.getElementById("idBtnC").disabled = false;
        document.getElementById("idBtnF").disabled = true;
        document.getElementById("idBtnF").style.opacity = 0.3;
        document.getElementById("idBtnC").style.opacity = 1;
        this.oState.isCelsius = false;
        this.oState.isFahrenheit = true;
    }
}

document.querySelector(".celsiusButton").addEventListener("click", function () {
    convertTemp('C');
});

document.querySelector(".fahrenheitButton").addEventListener("click", function () {
    convertTemp('F');
});