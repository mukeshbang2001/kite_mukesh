var KiteConnect = require("kiteconnect").KiteConnect;
var Promise = require('promise');
var config = require('./config.js');

var lotsMap = {
    "NIFTY19SEPFUT" : 75,
    "BANKNIFTY19SEPFUT" : 20
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

    // getOrders();
    // getOrderHistory(); // check later
    // getTrades();
    // getOrderTrades();

    // getInstruments();
    // getInstruments("NFO"); // NFO-FUT,NFO

    // getQuote(["NFO:NIFTY19SEPFUT"]).then(function (res) {
    //     console.log("response:%j", res);
    // }).catch(function (reason) {
    //     console.log("Err:%j", reason)
    // });
    //NFO:RELIANCE19SEPFUT


    // getOHLC(["NSE:RELIANCE"]);
    // getLTP(["NSE:RELIANCE"]);

    bracketOrderPlace1("NIFTY19SEPFUT", "BUY", 25, 10, 10, 12000, false, function (err, res) {
        console.log("Err;%j, Res:%j", err, res)
    });

}

function sessionHook() {
    console.log("User loggedout");
}

function getOrders() {
    kc.getOrders()
        .then(function(response) {
            console.log("-------------  Orders --------------")
            console.log(response)
            console.log("------------------------------------------------------")
        }).catch(function(err) {
        console.log(err);
    });
}

function getOrderHistory() {
    kc.getOrders()
        .then(function(response) {
            console.log("-------------  Order History --------------")

            if (response.length === 0) {
                console.log("No orders.")
                return
            }

            kc.getOrderHistory(response[0].order_id)
                .then(function(response) {
                    console.log(response);
                }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
        console.log(err);
    });
}

function getTrades() {
    kc.getTrades()
        .then(function(response) {
            console.log("-------------  Trades --------------")
            console.log(response)
            console.log("------------------------------------------------------")
        }).catch(function(err) {
        console.log(err);
    });
}

function getOrderTrades() {
    kc.getOrders()
        .then(function(response) {
            var completedOrdersID;
            for (var order of response) {
                if (order.status === kc.STATUS_COMPLETE) {
                    completedOrdersID = order.order_id;
                    break;
                }
            }

            if (!completedOrdersID) {
                console.log("No completed orders.")
                return
            }

            kc.getOrderTrades(completedOrdersID)
                .then(function(response) {
                    console.log(response);
                }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
        console.log(err);
    });
}

function getInstruments(exchange) {
    kc.getInstruments(exchange).then(function(response) {
        console.log("Instruments:" + response.length);

        response.forEach(function (item) {
            if(item.tradingsymbol && item.tradingsymbol.indexOf("NIFTY") > -1 && item.tradingsymbol.indexOf("FUT") > -1 )
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
function getQuote(instruments) {

    return new Promise(function (resolve, reject) {
        kc.getQuote(instruments).then(function(response) {
            resolve(response);
        }).catch(function(err) {
            reject(err)
        })

    })
}

function getOHLC(instruments) {
    kc.getOHLC(instruments).then(function(response) {
        console.log("==== ohlc =====")
        console.log(response);
    }).catch(function(err) {
        console.log(err);
    })
}

function getLTP(instruments) {
    kc.getLTP(instruments).then(function(response) {
        console.log(" LTP of " + instruments  + ": %j", response);
    }).catch(function(err) {
        console.log(err);
    })
}

function invalidateAccessToken(access_token) {
    console.log("Bracket Order placed response: ")

    kc.invalidateAccessToken(access_token)
        .then(function(response) {
            console.log(response);

        }).catch(function(err) {
        console.log(err.response);
    });
}


function isPriceReasonable(priceCheck, tradingSymbol, currPrice, toBeExercisePrice) {
    var diff = currPrice - toBeExercisePrice;
    console.log("Checking if price diff:%s is reasonable for %s:", diff, tradingSymbol)
    if (!priceCheck)
        return true;

    if (tradingSymbol == "NIFTY19SEPFUT" && Math.abs(diff) > 10) {
        return false
    } else if (tradingSymbol.endsWith("PE") || tradingSymbol.endsWith("CE")){
        if (diff*100/currPrice < 20) // 20% costly ??
            return false;
    } else {
        return true;
    }
}

function bracketOrderPlace1(tradingSymbol, transaction_type, lots, stopLoss, target, price, priceCheck, callback) {
    var orderType = "LIMIT";
    var myQuantity = lots*lotsMap[tradingSymbol];
    console.log("Bracket Order placed request: ")

    if (!lotsMap[tradingSymbol]){
        // get the details from Kite & add it to the lotsMap.
        console.log("Currnetly this tradingsymbol is not traded by this program:" + tradingSymbol);
        return callback("Currnetly this tradingsymbol is not traded by this program:" + tradingSymbol);
    }

    /**
     *
     * @param {string} variety Order variety (ex. bo, co, amo, regular).
     * @param {string} params Order params.
     * @param {string} params.exchange Exchange in which instrument is listed (NSE, BSE, NFO, BFO, CDS, MCX).
     * @param {string} params.product	Product code (NRML, MIS, CNC).
     * @param {string} params.order_type Order type (NRML, SL, SL-M, MARKET).
     * @param {string} [params.validity] Order validity (DAY, IOC).
     * @param {number} [params.price] Order Price
     * @param {number} [params.disclosed_quantity] Disclosed quantity
     * @param {number} [params.trigger_price] Trigger price
     * @param {number} [params.squareoff] Square off value (only for bracket orders)
     * @param {number} [params.stoploss] Stoploss value (only for bracket orders)
     * @param {number} [params.trailing_stoploss] Trailing stoploss value (only for bracket orders)

     */
    var payLoad = {
        "exchange": "NFO",
        "tradingsymbol": tradingSymbol,
        "transaction_type": transaction_type,
        "order_type": orderType,
        //params.order_type:
        "quantity": myQuantity,
        "price": price,
        "squareoff": target,
        "stoploss": stopLoss,
        "validity": "DAY"
    };

    // if SL-M, add params.trigger_price
    if (orderType == "SL")
        payLoad['trigger_price'] = price


    if (price ==0) {
        console.log("price is zero.. getting best price for :" + transaction_type)
        // get best buyprice from quote & place the order
        var instrument = "NFO:"+tradingSymbol;
        getQuote(instrument).then(function (value) {
            console.log(" quote: %j", value)

            if (transaction_type == "BUY"){
                // get best seller prices..
                var arr = value[instrument].depth.sell;
                console.log("checking best sellers: %j", arr)
            } else {
                // get best buyer prices..
                var arr = value[instrument].depth.buy;
                console.log("checking best buyers")
            }
            var i=0;
            var tmpQnty = myQuantity;
            console.log("i:%s, price:%j", i, price)

            while(price == 0 && i < 5){
                var arrElement = arr[i];
                console.log("i:%s, arrElement:%j", i, arrElement)
                if (tmpQnty < arrElement.quantity*arrElement.orders) {
                    price = arrElement.price;
                }
                else {
                    tmpQnty -= arrElement.quantity
                    i++;
                }
            }
            if (price ==0){
                console.log("LOTS not enough. place less number.")
            }
            console.log("setting price for transaction:" + price)

            // check if we can take this price
            if(!isPriceReasonable(priceCheck, tradingSymbol, value[instrument].last_price, price))
                price = 0;
            payLoad.price = price

            placeOrder(payLoad, callback)
        })
    } else {
        placeOrder(payLoad, callback)
    }

}


function placeOrder(payLoad, callback) {

    console.log("Placing order: %j", payLoad)
    kc.placeOrder(kc.VARIETY_BO, payLoad).then(function(resp) {
        console.log("Bracket Order placed response: %j",resp)
        callback(null, resp)
    }).catch(function(err) {
        console.log("Bracket Order placed error: %j", err )
        callback(err)
    });

}


module.exports.setLotSize = function (tradingSymbol, lotSize) {
    lotsMap[tradingSymbol] = lotSize;
}
module.exports.setAccessToken = function (_accessToken) {
    if(_accessToken)
        access_token = _accessToken
}

module.exports.placeOrder = bracketOrderPlace1