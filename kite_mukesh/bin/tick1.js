var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
var config = require('./config.js')
var amqp = require('amqplib/callback_api');

var updateCandles = false;

var kc = new KiteConnect({
    api_key: config.api_key
});
kc.setAccessToken(config.access_token);

var ticker = new KiteTicker({
    api_key: config.api_key,
    access_token: config.access_token
});

var prevVolume = 0;
var ticker = {
    connect :  function () {},
    on: function (event, fn) {

        if(event == 'ticks')
            setTimeout(function () {
                sendTick();
            }, 3000)

        function sendTick() {
            // console.log("sending Tick.., ")
            var randomTick = {
                    "tradable": true,
                    "mode": "full",
                    "instrument_token": 738561,
                    "last_price": Math.random()*1000,
                    "last_quantity": 500,
                    "volume": prevVolume + Math.random()*100,
                    "ohlc": {"open": 1292, "high": 1298.8, "low": 1283.5, "close": 1279.55},
                    "change": 1.3481302020241492,
                    "last_trade_time": "2019-09-26T10:29:18.000Z",
                    "timestamp": "2019-09-26T13:32:46.000Z",
                    "oi": 0,
                    "oi_day_high": 0,
                    "oi_day_low": 0
                }
                prevVolume = randomTick.volume
            ;
            onTicks([randomTick])
            setTimeout(sendTick, 1000);
        }
    },
    autoReconnect: function () {}
}
var stocksMap = {}
var ws_connection;
var _channel;
console.log("Ticker")
var TickManager = function (params) {
    ws_connection = params.connection;


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

}

// NIFTY19SEPFUT - 44461
// BANKNIFTY19SEPFUT - 44460

var count=0

function generateCandleKey(candle_type_time_in_sec) {
    return "sec_" + candle_type_time_in_sec;
}

function updateCandles(timeUnitInSec, stockData, tick) {
    var candleKey = generateCandleKey(timeUnitInSec);
    var candleArray = stockData['candles'][candleKey];
    var candle = candleArray[candleArray.length - 1];
    console.log('candle %s sec: %j', candleKey, candle)

    candle['close'] = tick.last_price;
    if (candle['open'] == 0) {
        candle['open'] = tick.last_price;
    }
    if (candle['high'] == 0 || candle['high'] < tick.last_price) {
        candle['high'] = tick.last_price;
        // todo: update a trigger
    }
    if (candle['low'] == 0 || candle['low'] > tick.last_price) {
        candle['low'] = tick.last_price;
        // todo: update a trigger
    }

    ws_connection.send(JSON.stringify({
        stockName: stockData.instrument,
        chartName: 'candle_' + candleKey,
        chartType: 'candle',
        data: candle,
        type: candle.type
    }))
    candle.type = 'update'
}

function onTicks(ticks) {
    // console.log("Ticks:", ticks);
    ticks.forEach(function (tick) {


        var lastPrice = tick.last_price;
        var lastQnty = tick.last_quantity;
        var volume = tick.volume;
        var instrument = tick.instrument_token;
        var oi = tick.oi;
        var ohlc = tick.ohlc;

/**
        console.log("%s. Price for instrument:" + instrument + ", is : " + lastPrice, count++)
        console.log("Volume for instrument:" + instrument + ", is : " + volume)
        console.log("lastQnty for instrument:" + instrument + ", is : " + lastQnty)
*/
        // updatePriceGraph(instrument, lastPrice);
        // updateVolumeGraph(instrument, volume);
        // updateLastQntyGraph(instrument, lastQnty);


        var stockData = stocksMap[instrument];
        if (!stockData) {
            console.log("Adding the stock to map & creating timers..")

            stocksMap[instrument] = {
                instrument: instrument,
                candles: {
                    sec_3: [],
                    sec_30: [],
                    sec_60: [],
                    sec_180: []
                },
                ticks: [],
                open: 0,
                high: 0,
                low: 0,
                close: 0,
                last_price: 0,
                volume: 0,
                last_quantity: 0

            };
            var stockData = stocksMap[instrument];

            if (updateCandles){
                createNewCandle(stockData,3)
                createNewCandle(stockData,30)
                createNewCandle(stockData,60)
                createNewCandle(stockData,180)
            }

            function createNewCandle(stockData, candle_type_time_in_sec) {
                var key = generateCandleKey(candle_type_time_in_sec);
                console.log("Creating new candle for stock: " + stockData.instrument + ", with key: " + key)
                if(!stockData['candles'][key]) stockData['candles'][key] = []

                stockData['candles'][key].push({
                    open:0,
                    high:0,
                    close:0,
                    low:0,
                    type: 'new'
                });

                if(stockData['candles'][key].length > 100){
                    stockData['candles'][key].shift();
                }
                setTimeout(createNewCandle, candle_type_time_in_sec * 1000, stockData, candle_type_time_in_sec)
            }

        }

        stockData.open = tick.ohlc.open
        stockData.close = tick.ohlc.close
        stockData.high = tick.ohlc.high
        stockData.low = tick.ohlc.low
        stockData.volume = tick.volume
        stockData.last_quantity = tick.last_quantity;

        [3,30,60,180].forEach(function (timeUnitInSec) {
            if (updateCandles)
                updateCandles(timeUnitInSec, stockData, tick);

        });


        // ws_connection.send(JSON.stringify(stocksMap[instrument]))
        console.log('sending tick: %j', ticks)
        ws_connection.send(JSON.stringify({
            event: 'details',
            data: {
                percent_change: tick.change,
                price_change: stockData.close - tick.last_price,
                last_price: tick.last_price,
                volume: tick.volume,
                volume_change: tick.volume - (stockData.last_tick ? stockData.last_tick.volume : 0)
            }
        }))

        ws_connection.send(JSON.stringify({
            stockName: stockData.instrument,
            chartType: 'multi',
            data: {
                x: new Date().getTime(),
                last_price: tick.last_price,
                volume: tick.volume,
                volume_change: tick.volume - (stockData.last_tick ? stockData.last_tick.volume : 0)
            }
        }))

        // console.log("Tick volume: %s, last volume:%s", tick.volume, (stockData.last_tick ? stockData.last_tick.volume : 0))
        // triggerAlgo1(stocksMap[instrument], tick.last_price);

        stockData.last_tick = tick;
        stockData.ticks.push(tick);

        _channel.sendToQueue("trade_ticks", Buffer.from(JSON.stringify(tick)));
        console.log(" [x] Sent %s", JSON.stringify(stockData));


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

module.exports = TickManager