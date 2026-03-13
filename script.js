const consoleBox = document.getElementById("consoleLog");

function log(msg){
console.log(msg);
consoleBox.textContent += msg + "\n";
}

function saveHistory(city){
let history = JSON.parse(localStorage.getItem("cities")) || [];

if(!history.includes(city)){
history.push(city);
localStorage.setItem("cities",JSON.stringify(history));
}

displayHistory();
}

function displayHistory(){
let history = JSON.parse(localStorage.getItem("cities")) || [];
let historyDiv = document.getElementById("history");

historyDiv.innerHTML="";

history.forEach(city=>{
let btn=document.createElement("button");
btn.textContent=city;
btn.className="history-btn";
btn.onclick=()=>getWeather(city);
historyDiv.appendChild(btn);
});
}

async function getWeather(cityName){

consoleBox.textContent="";

let city = cityName || document.getElementById("cityInput").value;

if(city===""){
alert("Enter city name");
return;
}

try{

log("1 Sync Start");

setTimeout(()=>{
log("4 setTimeout (Macrotask)");
},0);

Promise.resolve().then(()=>{
log("3 Promise.then (Microtask)");
});

log("[ASYNC] Start fetching");


const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
const geoData = await geoRes.json();

if(!geoData.results){
throw new Error("City not found");
}

const lat = geoData.results[0].latitude;
const lon = geoData.results[0].longitude;


const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
const weatherData = await weatherRes.json();

displayWeather(city, weatherData);

saveHistory(city);

log("2 Sync End");

}catch(error){

document.getElementById("weatherResult").innerHTML =
`<p style="color:red">${error.message}</p>`;

log("Error: "+error.message);

}

}

function displayWeather(city,data){

document.getElementById("weatherResult").innerHTML = `
<p><b>City:</b> ${city}</p>
<p><b>Temp:</b> ${data.current_weather.temperature} °C</p>
<p><b>Wind Speed:</b> ${data.current_weather.windspeed} km/h</p>
`;

}

displayHistory();