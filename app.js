const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
const fs = require('fs');

// Heroku environment variables
const PORT = 5007;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/', (req, res) => res.render('landing'));
app.get('/mobile', (req, res) => res.render('mobile'));
app.get('/bigdata', (req, res) => res.render('bigdata'));
app.get('/iot', (req, res) => res.render('iot'));
app.get('/management', (req, res) => res.render('management'));
app.get('/conduct', (req, res) => res.render('conduct'));
app.get('/process', (req, res) => res.render('process'));
app.get('/locations', (req, res) => res.render('locations'));
app.get('/contact', (req, res) => res.render('contact'));


function stop() {
  server.close();
}

module.exports = app;
module.exports.stop = stop;