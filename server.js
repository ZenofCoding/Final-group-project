
var express = require('express');
var   app               = express();
var   bodyParser        = require('body-parser');
//var    mongoose          = require('mongoose'),
  
var FitbitApiClient = require('./client/oauth');

//var mongoose = require('mongoose');
//app.use(bodyParser());
var app = express();

// initialize the Fitbit API client
var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("22828X", "d24dfc6f7bb64f374459e04747b67cf8");

// redirect the user to the Fitbit authorization page
app.get("/authorize", function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:3000/auth/fitbit/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/auth/fitbit/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://localhost:3000/auth/fitbit/callback').then(function (result) {
        // use the access token to fetch the user's profile information
        client.get("/profile.json", result.access_token).then(function (results) {
            res.send(results);
        });
    }).catch(function (error) {
        res.send(error);
    });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

app.listen(3000, function() {
  console.log('I\'m Listening...');
})