var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
var config = require('./config.js')

var kc = new KiteConnect({
    api_key: config.api_key
});
var ticker = new KiteTicker({
    api_key: config.api_key,
    access_token: config.access_token
});

// NIFTY19SEPFUT - 44461
// BANKNIFTY19SEPFUT - 44460
var _channel;
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        _channel = channel;

        var queue = 'trade_ticks';

        channel.assertQueue(queue, {
            durable: false
        });

        ticker.autoReconnect(true, 20, 5)
        ticker.connect();


        ticker.on("ticks", onTicks);
        ticker.on("connect", subscribe);
        ticker.on("noreconnect", function() {
            console.log("....  noreconnect");
        });

        ticker.on("reconnecting", function(reconnect_interval, reconnections) {
            console.log("Reconnecting: attempt - ", reconnections, " innterval - ", reconnect_interval);
        });

    });
});



function onTicks(ticks) {
    console.log("Ticks:", ticks);
    ticks.forEach(function (tick) {

        var lastPrice = tick.last_price;
        var lastQnty = tick.last_quantity;
        var volume = tick.volume;
        var instrument = tick.instrument_token;
        var oi = tick.oi;
        var ohlc = tick.ohlc;

        console.log("Price for instrument:" + instrument + ", is : " +  lastPrice )
        console.log("Volume for instrument:" + instrument + ", is : " +  volume )
        console.log("lastQnty for instrument:" + instrument + ", is : " +  lastQnty )

        // updatePriceGraph(instrument, lastPrice);
        // updateVolumeGraph(instrument, volume);
        // updateLastQntyGraph(instrument, lastQnty);

        _channel.sendToQueue("trade_ticks", Buffer.from(JSON.stringify(tick)));
        console.log(" [x] Sent %s", tick);

    })
}

function subscribe() {
    var items = [738561, 11382018];
    console.log("connected.. Subscribing items: " + items)
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
}


