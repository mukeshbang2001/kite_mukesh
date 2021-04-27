var KiteConnect = require("kiteconnect").KiteConnect;
var config = require('./config.js')
var kc = new KiteConnect({
    api_key: config.api_key
});

var reqToken = config.request_token;
var api_secret = config.secret;

// https://kite.zerodha.com/connect/login?api_key=<api_key>


kc.generateSession(reqToken, api_secret)
    .then(function (response) {
        console.log("generated the session")
        console.log("response: %j", response)
        var access_token = response.access_token;
        var public_token = response.public_token;
    })
    .catch(function (err) {
        console.log("error:%j", err);
    });
