const request = require('request');

const options = {
    url: 'https://kite.zerodha.com/oms/instruments/historical/13433346/minute?user_id=YJ6753&oi=1&from=2020-01-30+09:00:00&to=2020-02-29+09:15:00',
    headers: {
        "authorization": "enctoken b6D7BMPOGBxx6tX1gw4NoIGYz+gQtcOkkkySzEq5wHZBSqAtmZbXRknCttW0u3VazBFw0z20BAzebF+E+wtNWfVaDi3bKw==",
    },
    json: true
};

request.get(options, function (e,r,user) {
    console.log("e:%j", e)
    console.log("r:%j", r)
    console.log("user:%j", user)

})