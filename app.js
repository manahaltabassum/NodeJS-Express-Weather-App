// using request package to make API call
const request = require('request');

// API call values
const apiKey = 'ENTER API KEY HERE';

const express = require('express');
const app = express();
// middleware (functions that have access to the req and res bodies)
const bodyParser = require('body-parser');

const latitude = ['37.287659', '41.256538', '30.267153', '39.446171'];
const longitude = ['-121.942429', '-95.934502', '-97.743057', '-76.615356'];
let temps = [];

// access static files within public folder
app.use(express.static('public'));
// allows us to make use of the req.body object
app.use(bodyParser.urlencoded({extended: true}));
// set up template engine
app.set('view engine', 'ejs');

function getTemps() {
    const promise = new Promise((resolve, reject) => {
        for (let i = 0; i < latitude.length; i++){
            let lat = latitude[i];
            let long = longitude[i];
            let url = `https://api.darksky.net/forecast/${apiKey}/${lat},${long}`;
            request(url, (err, response, body) => {
                if (err){
                    temps.push('Error, unable to get temperature');
                } else {
                    let weather = JSON.parse(body);
                    let temp = `${weather.currently.temperature}`;
                    // console.log(temp);
                    temps.push(temp);
                    // console.log(temps);
                    if (temps.length == 4){
                        resolve();
                    }
                }
            })
        }
    });
    return promise;
}


app.get('/', (req, res) => {
    // res.send('Hello World!');
    // renders view and sends equivalent HTML to client
    getTemps().then(() => {
        console.log(temps);
        res.render('index', {weather: null, error: null, campbell: temps[0], omaha: temps[1], austin: temps[2], timonium: temps[3]});
    });
});

app.post('/', (req, res) => {
    let lat = req.body.latitude;
    let long = req.body.longitude;
    let url = `https://api.darksky.net/forecast/${apiKey}/${lat},${long}`;

    // pass in url that returns a callback function
    // if error in request, log the error
    // if no error, then log contents of response body
    request(url, (err, response, body) => {
        if (err){
            res.render('index', {weather: null, error: 'Error, please try again', campbell: temps[0], omaha: temps[1], austin: temps[2], timonium: temps[3]});
            // console.log('error:', error);
        } else {
            let weather = JSON.parse(body);
            let message = `It's ${weather.currently.temperature} degrees at ${latitude} and ${longitude}!`;
            // console.log(message);
            res.render('index', {weather: message, error: null, campbell: temps[0], omaha: temps[1], austin: temps[2], timonium: temps[3]});
        }
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})