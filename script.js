async function getWeather() {

    const city = document.getElementById("searchBar").value;

    const url = `/api/weather?city=${city}`;

    try {
        const response = await fetch(url);
        console.log("contacted api");

        const data = await response.json();
        console.log("recieved and stored data");

        console.log(data);
        return data;
    }
    catch (err) {
        console.log("unable to fetch data lol", err);
    }
    
}

function setTheme(sky) {

    const root = document.documentElement;

    if (sky == "Golden") {
        root.setAttribute("data-theme", "goldenHour");
    }
    else if (sky == "Clear") {
        root.setAttribute("data-theme", "clearDay");
    }
    else if (sky == "Sunset Gradient") {
        root.setAttribute("data-theme", "set");
    }
    else if (sky == "Sunrise Gradient") {
        root.setAttribute("data-theme", "rise");
    }
    else if (sky == "Night") {
        root.setAttribute("data-theme", "clearNight");
    }
    else if (sky == "Clouds") {
        root.setAttribute("data-theme", "cloudy");
    }
    else if (sky == "Rain") {
        root.setAttribute("data-theme", "rainy");
    }
}

async function showWeather(e) {

    e.preventDefault();
    
    const data = await getWeather();
    if (!data) {
        document.getElementById("weatherResult").innerText = `failed to get weather`;
        return;
    }

    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const currTime = Date.now()/1000;
    const goldenThreshold = 3600;
    const gradientThreshold = 1800;

    var isGoldenHour = false;
    var isDay = false;
    var isNight = false;
    var isRiseGradient = false;
    var isSetGradient = false;

    if (currTime < sunrise) {
        if (currTime > sunrise - gradientThreshold) {
            isRiseGradient = true;
        }
        else {
            isNight = true;
        }
    }
    else if (currTime >= sunrise) {
        if (currTime < sunrise + goldenThreshold) {
            isGoldenHour = true;
        }
        else if (currTime > sunset - goldenThreshold && currTime < sunset) {
            isGoldenHour = true;
        }
        else if (currTime > sunset && currTime < sunset + gradientThreshold) {
            isSetGradient = true;
        }
        else if (currTime > sunset + gradientThreshold) {
            isNight = true;
        }
        else {
            isDay = true;
        }
    }
    
    let emoji = ``;

    let sky = data.weather?.[0]?.main; 
    // data.weather[0].main is the basic way to do this and technically correct, 
    // but the extra dot and question marks protect the program from crashing
    // just in case the api doesnt return the correct data

    console.log(`sky is ` + sky);

    if (sky === "Clear" && isNight) {
        sky = "Night";
    } 
    else if (sky === "Clear" && isGoldenHour) {
        sky = "Golden";
    } 
    else if (sky === "Clear" && isRiseGradient) {
        sky = "Sunrise Gradient";
    } 
    else if (sky === "Clear" && isSetGradient) {
        sky = "Sunset Gradient";
    } 
    if (sky === "Clear" && isDay) {
        sky = "Clear";
    } 

    console.log(`updated sky is ` + sky);

    setTheme(sky);

  

    switch (sky) {
        case 'Clouds':
            emoji = `☁️`;
            break;
        case 'Clear':
            emoji = `☀️`;
            break;
        case 'Rain':
            emoji = `🌧️`;
            break;
        case 'Snow':
            emoji = '🌨️';
            break;
        case 'Night':
            emoji = `🌗`;
            break;
        case 'Golden':
            emoji = `🌅`;
            break;
        case 'Sunrise Gradient':
            emoji = `🌅`;
            break;
        case 'Sunset Gradient':
            emoji = `🌅`;
            break;
        default:
            emoji = `🌡️`;
            break;
    }

    document.getElementById("weatherResult").innerText = `${emoji} ${data.main.temp}°F`;
    
}


// const input = document.getElementById("searchBar");
// const header = document.getElementById("header");

// input.addEventListener("input", () => {
//     header.textContent = `What's the Weather in ${input.value}?`;
// });
