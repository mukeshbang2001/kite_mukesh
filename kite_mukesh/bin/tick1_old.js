var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
var config = require('./config.js')
var amqp = require('amqplib/callback_api');
var async = require('async')
kc = new KiteConnect({
    api_key: config.api_key
});
kc.setAccessToken(config.access_token);

var ticker = new KiteTicker({
    api_key: config.api_key,
    access_token: config.access_token
});

var _channel;
console.log("Starting...")
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        _channel = channel;

        var queue = 'trade_ticks';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log("Starting ticks...")

        ticker.autoReconnect(true, 20, 5)
        ticker.connect();
        //
        //
        ticker.on("ticks", onTicks);
        ticker.on("connect", subscribe);
        ticker.on("noreconnect", function () {
            console.log("....  noreconnect");
        });

        ticker.on("reconnecting", function (reconnect_interval, reconnections) {
            console.log("Reconnecting: attempt - ", reconnections, " innterval - ", reconnect_interval);
        });

    });
});



// NIFTY19SEPFUT - 44461
// BANKNIFTY19SEPFUT - 44460


function onTicks(ticks) {
    console.log("Ticks:", ticks);
    ticks.forEach(function (tick) {

        var lastPrice = tick.last_price;
        var lastQnty = tick.last_quantity;
        var volume = tick.volume;
        var instrument = tick.instrument_token;
        var oi = tick.oi;
        var ohlc = tick.ohlc;

        console.log("Price for instrument:" + instrument + ", is : " + lastPrice)
        console.log("Volume for instrument:" + instrument + ", is : " + volume)
        console.log("lastQnty for instrument:" + instrument + ", is : " + lastQnty)

        // updatePriceGraph(instrument, lastPrice);
        // updateVolumeGraph(instrument, volume);
        // updateLastQntyGraph(instrument, lastQnty);



        _channel.sendToQueue("trade_ticks", Buffer.from(JSON.stringify(tick)));
        console.log(" [x] Sent %s", JSON.stringify(tick));


    })
}

function subscribe() {


    var tokens = [];
    // ticker.subscribe(tokens);
    // ticker.setMode(ticker.modeFull, tokens);

    var instruments = []
    config.list_of_trading_symbols.forEach(function (value) { instruments.push("NFO:"+value) })
    kc.getQuote(instruments).then(function (value) {
        console.log("Value:%j", value)
        instruments.forEach(function (instrument) {
            if(value[instrument])
                tokens.push(value[instrument].instrument_token)
        })
        console.log("Tokens to subscribe(%s): %j, ", tokens.length, tokens);
        ticker.subscribe(tokens);
        ticker.setMode(ticker.modeFull, tokens);

        console.log("connected.. Subscribing items: " + tokens)


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

