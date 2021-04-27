const request = require('request');

const options = {
    url: 'https://kite.zerodha.com/oms/quote/ohlc?user_id=YJ6753&i=NSE:INFY&i=NSE:ESCORTS&i=NSE:NIFTY+50',
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


// Ref: https://kite.trade/forum/discussion/2094/kite-connect-3-0-release-2-sep-11#latest