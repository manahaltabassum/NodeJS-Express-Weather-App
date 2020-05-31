// using request package to make API call
const request = require('request');

// API call values
const apiKey = 'ENTER API KEY BEFORE RUNNING';

const express = require('express');
const app = express();
// middleware (functions that have access to the req and res bodies)
const bodyParser = require('body-parser');

// access static files within public folder
app.use(express.static('public'));
// allows us to make use of the req.body object
app.use(bodyParser.urlencoded({extended: true}));
// set up template engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.send('Hello World!');
    // renders view and sends equivalent HTML to client
    res.render('index', {weather: null, error: null});
});

app.post('/', (req, res) => {
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let url = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`;

    // res.render('index');
    // console.log('Latitude:', req.body.latitude);
    // console.log('Longitude:', req.body.longitude);

    // pass in url that returns a callback function
    // if error in request, log the error
    // if no error, then log contents of response body
    request(url, (err, response, body) => {
        if (err){
            res.render('index', {weather: null, error: 'Error, please try again'});
            // console.log('error:', error);
        } else {
            let weather = JSON.parse(body);
            let message = `It's ${weather.currently.temperature} degrees in San Jose!`;
            // console.log(message);
            res.render('index', {weather: message, error: null});
        }
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})