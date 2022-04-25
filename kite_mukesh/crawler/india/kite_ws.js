const util = require('util');
const queue = 'stocks_algo'

const WebSocket = require('ws');
var amqp = require('amqplib/callback_api');
var instrument_tokens = require('./config/instrument_tokens.js')


var futInstrumentsMap = instrument_tokens.futInstrumentsMap;
var futInstrumentInverseMap = swap(futInstrumentsMap, "-FUT")

var cashInstrumentsNseMap = instrument_tokens.cashInstrumentsNse;
var cashInstrumentsNseInverseMap = swap(cashInstrumentsNseMap, "")

function swap(json, suffix){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key+suffix;
    }
    return ret;
}



//const url = 'wss://ws.zerodha.com/?user_id=YJ6753'
const url = 'wss://ws.zerodha.com/?api_key=kitefront&user_id=YJ6753&enctoken=3O1kySrM0cJc3LU9P2kFUb6ZDCwHeY3fD08q%2FNiBMcfnaogibkrfa7Y5BguA3kmvjlKlqGeU%2BN57SgmFVuz8aHSyVixcTujSIqm9EjviyqNTOTJX2Qio4Q%3D%3D&uid=1650599026920&user-agent=kite3-web&version=2.9.11'

let wsConnection = new WebSocket(url);


const watchListConfig = require('./config/watchlist.js');
const watchList = watchListConfig.watchlist;


console.log("Instrument watch list: Codes: %j", watchList)
var  instrumentArrayCash = watchList.CASH.map(code => cashInstrumentsNseMap[code]);
var  instrumentArrayFNO = watchList.FNO.map(code => futInstrumentsMap[code]);




console.log("[Cash] Instrument watch list: Tokens: %j", instrumentArrayCash)
console.log("[FNO] Instrument watch list: Tokens: %j", instrumentArrayFNO)
var rmqChannel;

wsConnection.onclose = () => {
    wsConnection =  new WebSocket(url);
}
wsConnection.onopen = () => {
    var rmq_endpoint = 'amqp://localhost';
    // var rmq_endpoint = 'amqp://ajibcwwi:ERwL8LLcMMeV0oHCxOygBl2blpp416fo@lionfish.rmq.cloudamqp.com/ajibcwwi'
    // var rmq_endpoint = 'amqp://zdhlrtgg:BCK1rAH6VFe7llMiJOll9pXBX_GHRKM0@lionfish.rmq.cloudamqp.com/zdhlrtgg'
    amqp.connect(rmq_endpoint, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            rmqChannel = channel;

            channel.assertQueue(queue, {
                durable: false
            });

            wsConnection.send(JSON.stringify({"a":"subscribe","v": instrumentArrayCash}))
            wsConnection.send(JSON.stringify({"a":"subscribe","v": instrumentArrayFNO}))

            wsConnection.send(JSON.stringify({"a":"mode","v":["quote", instrumentArrayCash]}))
            wsConnection.send(JSON.stringify({"a":"mode","v":["full", instrumentArrayFNO]}))


        });
    })
    // var value = {"a":"subscribe","v":[408065]};

    // ltp: packet size: 8, (only ltp)
    // connection.send(JSON.stringify({"a":"mode","v":["ltp",[245249]]}))

    // ltpc: packet size: 12 --> (ltp & close)
    // connection.send(JSON.stringify({"a":"mode","v":["ltpc",[245249]]}))

    // quote: packet size: 44 (till ohlc price)
    // connection.send(JSON.stringify({"a":"mode","v":["quote",[245249]]}))

    // full: packet size: 184 (all data including best buy & sell array)
    // connection.send(JSON.stringify({"a":"mode","v":["full",[22211074]]}))
}


wsConnection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
    wsConnection =  new WebSocket(url);
}

function processPacket(packetByteArray, packetLength) {

    var tmpProcessedBytes = 0;

    function decodeBytes() {
        var value = packetByteArray[0 + tmpProcessedBytes] * 256 * 256 * 256 + packetByteArray[1 + tmpProcessedBytes] * 256 * 256 + packetByteArray[2 + tmpProcessedBytes] * 256 + packetByteArray[tmpProcessedBytes + 3];
        tmpProcessedBytes +=4;

        return value;
    }

    let instrumentToken = decodeBytes();
    let lastTradePrice = decodeBytes()/100

    // -- Thus ends packet if its -- "ltp"

    let lastTradeQnty = decodeBytes();

    // -- Thus ends packet if its -- "ltpc"

    var averageTradedPrice = decodeBytes()/100;
    var volTraded = decodeBytes();
    var totalBuyQnty = decodeBytes();
    var totalSellQnty = decodeBytes();
    var openPrice = decodeBytes()/100;
    var highPrice = decodeBytes()/100;
    var lowPrice = decodeBytes()/100;
    var closePrice = decodeBytes()/100;

    // --- Thus ends if its 'quote' ----

    var timeStamp = decodeBytes();
    var openInt = decodeBytes();
    var openIntDayHigh = decodeBytes();
    var openIntDayLow = decodeBytes();
    var exchangeTs = decodeBytes();

    // Next comes market depth.. Ignore.

    var packet = {
        code: cashInstrumentsNseInverseMap[instrumentToken] || futInstrumentInverseMap[instrumentToken],
        instrumentToken: instrumentToken,
        lastTradePrice: lastTradePrice,
        lastTradeQnty: lastTradeQnty,
        averageTradedPrice: averageTradedPrice,
        volTraded: volTraded,
        totalBuyQnty: totalBuyQnty,
        totalSellQnty: totalSellQnty,
        openPrice: openPrice,
        highPrice: highPrice,
        lowPrice: lowPrice,
        closePrice: closePrice,

        timeStamp :timeStamp,
        openInt :openInt,
        openIntDayHigh: openIntDayHigh,
        openIntDayLow: openIntDayLow,
        exchangeTs:exchangeTs
    }



    // console.log(util.format("[Len:%s][Instrument:%s] packetByteArr:%s",packetLength, instrumentToken, packetByteArray))
    // console.log(util.format("Instruent_Token: %s, LTP: %s, LTQ: %s", instrumentToken, lastTradePrice, lastTradeQnty))
    // console.log(util.format("Packet: %j",packet))

    return packet;
}

function sendToRMQ(msg) {
    // console.log("Mukesh - Sending to RMQ: %j", msg);
    rmqChannel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
}
var prevData = {

}

// display the diff of previous to current packet.
function checkDiff(oldMsg, msg, lotSize) {
    let volDiff = (msg.volTraded - oldMsg.volTraded)/lotSize;
/*
    console.log("mukesh stock:%s, volumeDiff: %s, buyDiff:%s, sellDiff:%s, buySellDiff_Curr:%s",
        msg.code,
        volDiff,
        (msg.totalBuyQnty - oldMsg.totalBuyQnty)/lotSize,
        (msg.totalSellQnty - oldMsg.totalSellQnty)/lotSize,
        (msg.totalSellQnty - msg.totalBuyQnty)/lotSize,
        )
*/




}

function createMsgPacketForRMQ(key, value, instrumentToken, ts, prevClose) {
    console.log("----- prevClose:%j, value:%j, stock:%j, diff:%j", prevClose, value, key, (value-prevClose)*100/prevClose );
    return {"stockName": key, "value": value, "instrument": instrumentToken,  "prevClose": prevClose, "percentChange": (value-prevClose)*100/prevClose};
}

wsConnection.onmessage = (e) => {
    var arrByte = Uint8Array.from(e.data)

    var nPackets = arrByte[0]*256 + arrByte[1];
    // console.log("nPackets:" + nPackets)

    var pktProcessedCount = 0;
    var prevLength = 2;
    while (pktProcessedCount < nPackets){

        var lengthOfPacket = arrByte[0+prevLength]*256 + arrByte[1+prevLength];
        var packetByteArray = arrByte.slice(prevLength + 2,prevLength + 2 + lengthOfPacket)

        console.log("------------:")
        var packet = processPacket(packetByteArray, lengthOfPacket);
        // console.log(util.format("Mukesh Packet: %j",packet))

        var msg = createMsgPacketForRMQ(packet.code, packet.lastTradePrice, packet.instrumentToken, packet.exchangeTs, packet.closePrice);
        sendToRMQ(msg);

/*

        if(watchListConfig.oi_watchlist.indexOf(packet.code) > -1){
            msg = createMsgPacketForRMQ(packet.code+"-oi", packet.openInt, packet.instrumentToken, packet.exchangeTs, packet.closePrice);
            sendToRMQ(msg);
        }

        if(watchListConfig.vol_watchlist.indexOf(packet.code) > -1) {
            msg = createMsgPacketForRMQ(packet.code + "-vol", packet.volTraded, packet.instrumentToken, packet.exchangeTs);
            // msg = {"stockName": packet.code + "-qty", "value": packet.lastTradeQnty};

            sendToRMQ(msg);
        }
*/
        var oldMsg = prevData[packet.code];
        prevData[packet.code] = packet;

        // console.log("mukesh - PrevData:%j", prevData)
        if(oldMsg){
            checkDiff(oldMsg, packet, packet.lastTradeQnty);
        }
        prevLength += 2 + lengthOfPacket;
        pktProcessedCount ++;
    }



    // arrByte.forEach(value => console.log(value))
    // var z = new Buffer(arrByte).toString('ascii');
    // console.log("Val: " +z)

}



