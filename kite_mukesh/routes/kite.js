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

router.get('/placeOrder', function(req, res, next) {
    console.log("Req:%j",req.query);
    var tradingSymbol = req.query.tradingSymbol;
    var transactionType = req.query.transactionType;
    var lots = req.query.lots;
    var stopLoss = req.query.stopLoss;
    var target = req.query.target;
    var priceCheck = req.query.priceCheck;


    myKiteClient.placeOrder(tradingSymbol, transactionType, lots, stopLoss, target, 0, priceCheck, function (err, orderId) {
        res.send('kite publisher,'+ JSON.stringify(req.query));
    })
});

router.get('/updateAccessToken', function(req, res, next) {
    console.log("Req:%j",req.query);
    kc.setAccessToken(req.query.accessToken)
    res.send('kite publisher,'+ JSON.stringify(req.query));
});

module.exports = router;
