const http = require("http")
const express = require("express")
const ejs = require("ejs")
const fs = require("fs")
var requests = require("requests");
const bodyParser = require("body-parser")
const homefile = fs.readFileSync("views/weather.ejs", "utf-8");
var search = "Mumbai";

var requests = require("requests");

const app = express()

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({
    extended: true
  }))

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempMin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempMax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}",orgVal.weather[0].main);

    //console.log(temperature)
    return temperature;
}

app.get("/",function(req,res){
    requests(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=ebf7ecfa8866033a139346ae1497f685`)
    .on("data", function (chunk) {
        const objData = JSON.parse(chunk);
        const arrayData = [objData]
       // console.log(arrayData[0].main.temp)
        const realTimeData = arrayData.map((val) => replaceVal(homefile, val))
        .join("");
        res.write(realTimeData);   
})
    .on("end", function (err) {
     if (err) return console.log('connection closed due to errors', err);
     res.end();

});
})

app.post("/",function(req,res){
    search = req.body.search
    res.redirect("/")
})

app.listen(8000, "127.0.0.1");