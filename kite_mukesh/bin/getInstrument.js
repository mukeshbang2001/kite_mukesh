var KiteConnect = require("kiteconnect").KiteConnect;
var Promise = require('promise');
var config = require('./config.js');

var lotsMap = config.lotsMap || {
    "NIFTY19OCTFUT" : 75,
    "BANKNIFTY19OCTFUT" : 20
}

var api_key = config.api_key,
    secret = config.secret,
    request_token = config.request_token,
    access_token = config.access_token;

var options = {
    "api_key": api_key,
    "debug": false
};

kc = new KiteConnect(options);
kc.setSessionExpiryHook(sessionHook);


function generateAccessToken(requestToken) {
    kc.generateSession(requestToken, secret)
        .then(function (response) {
            console.log("Access token Response", response);
            init();
        })
        .catch(function (err) {
            console.log("Session generation failed.. " + err);
        })
}

if(!access_token) {
    generateAccessToken(request_token);
} else {
    kc.setAccessToken(access_token);
    init();
}

function init() {
    console.log("login url: " + kc.getLoginURL())


    getInstruments();
    getInstruments("NFO"); // NFO-FUT,NFO

    getQuote([13906690, 13177346,'NIFTY19SEPFUT:NSE', 'NSE:INFY', 'NFO:NIFTY19O0311500PE', 'NIFTY19OCTFUT:NFO', 'NFO:NIFTY19OCTFUT', 'NSE:NIFTY19SEPFUT', 13177346]).then(function (value) {
        console.log(value)
    }).catch(function (reason) {
        console.log(reason)
    })
}

function getQuote(instruments) {

    return new Promise(function (resolve, reject) {
        kc.getQuote(instruments).then(function(response) {
            resolve(response);
        }).catch(function(err) {
            reject(err)
        })

    })
}

function sessionHook() {
    console.log("User loggedout");
}





function getInstruments(exchange) {
    kc.getInstruments(exchange).then(function(response) {
        console.log("Instruments:" + response.length);

        response.forEach(function (item) {
            if(item.tradingsymbol && item.tradingsymbol.indexOf("HAVEL") > -1 && item.tradingsymbol.indexOf("FUT") > -1 )
                console.log("%j", item)
        })
    }).catch(function(err) {
        console.log(err);
    })
}

/**
 *
 * @param instruments : e.g, NFO:NIFTY19SEPFUT
 * @returns {Promise}
 */


module.exports.setAccessToken = function (_accessToken) {
    if(_accessToken)
        access_token = _accessToken
}

