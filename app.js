const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const csv=require('csvtojson')
const path = require("path");
const fs = require("fs");
var jsonArray = [];
var moviesList;
var movieName;
var result = "";
const directoryPath = path.join(__dirname, 'xray_jsonfiles');
// console.log(directoryPath);
var xray_list = [];
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

(async function () {
    await fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            xray_list.push(file);
        });
    });
        var moviesList = xray_list;
        app.get("/", (req, res) => {
            res.sendFile(__dirname + "/homepage.html")
        });
        
        app.get("/movies", (req, res) => {
            res.json(JSON.stringify(moviesList));
        });
        
        app.get("/movie", (req, res) => {
            res.json(jsonArray);
        });
        app.get("/topchar", (req, res) => {
            res.json(result);
        });
        app.get("/chart", async (req, res) => {
            result = [];
            await jsonArray.reduce(function(res, value) {
              if (!res[value.character]) {
                res[value.character] = { character: value.character, duration: 0 };
                result.push(res[value.character])
              }
              res[value.character].duration += Number(value.duration);
              return res;
            }, {});
            res.sendFile(__dirname + "/charts.html");
        });
        app.get("/moviename", (req, res) => {
            res.json(movieName);
        });
        app.post("/", async (req, res) => {
            const movieFileName = req.body.movieFileName;
            movieName = getMovieName(movieFileName);
            const csvPath = path.join(__dirname, 'xray_jsonfiles', movieFileName);
            jsonArray = await csv().fromFile(csvPath);
            res.redirect("/chart");
        });
        
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on Port 3000!");
        });
})();

function getMovieName(movieFileName) {
    return movieFileName.split(") ")[1].split("_xray.csv")[0].replace(/_/g, ' ');
}