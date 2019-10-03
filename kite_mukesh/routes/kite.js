var express = require('express');
var router = express.Router();

var myKiteClient = require('../bin/kite_example.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/trade', function(req, res, next) {
  console.log("Req:%j",req.query);
  res.send('kite publisher,'+ JSON.stringify(req.query));
});

function getStrike(val, type){
    var round_fig = val > 20000 ? 100 : 50;
    var tmp = val - val%round_fig
    if (type== 'SELL')
        tmp = tmp+round_fig;

    return tmp;
}

function sendSuccess(res, msg){
    res.send(msg);

}

function sendError(){


}


router.get('/placeOrder', function(req, res, next) {
    console.log("Req:%j",req.query);
    var tradingSymbol = req.query.tradingSymbol;
    var transactionType = req.query.transactionType;
    var lots = req.query.lots;
    var stopLoss = req.query.stopLoss;
    var target = req.query.target;
    var lastPrice = req.query.last_price_param
    var priceCheck = req.query.priceCheck;

    var OptFut = req.query.stock_type
    if (OptFut == "opt"){
        if (tradingSymbol != 'NIFTY' || tradingSymbol != 'BANKNIFTY'){
            res.send('Error:,'+ JSON.stringify(req.query));
            return;
        }

        var optType = ""
        var strike = getStrike(lastPrice, transactionType);
        if(transactionType == 'BUY'){
            optType = "CE"
        }
        if (transactionType == 'SELL') {
            optType = "PE"
        }

        transactionType = 'BUY';
        tradingSymbol = tradingSymbol + "NIFTY19O03" + strike + optType
    } else if (OptFut == "fut"){
        tradingSymbol = tradingSymbol + "19OCTFUT"
    }

    myKiteClient.placeOrder(tradingSymbol, transactionType, lots, stopLoss, target, 0, priceCheck, function (err, orderId) {
        res.sendStatus(200);
    })
});

router.get('/updateAccessToken', function(req, res, next) {
    console.log("Req:%j",req.query);
    kc.setAccessToken(req.query.accessToken)
    res.send('kite publisher,'+ JSON.stringify(req.query));
});

router.get('/test', function(req, res, next) {
    console.log("Req:%j",req.query);
    res.send({a:'test'});
});

module.exports = router;
