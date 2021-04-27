#!/usr/bin/env node
const request = require('request');
const util = require('util');
var queue = 'stocks';

const options = {
    url: 'https://api.nasdaq.com/api/quote/watchlist?symbol=ndx|index|futures'
//    add more like s&p or dow jones
};

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: false
        });


        function ping(){
            request(options, function (err, response, body) {
                console.log("error : %s", err);
                console.log("body : %s", body);

                if(!body) return;
                JSON.parse(body).data.forEach(obj => {
                    var msg = {"stockName":obj.symbol,"instrument":obj.symbol,"value": obj.lastSalePrice};
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                    console.log(" [x] Sent %s", msg);

                })
            });

            setTimeout(ping, 3000);
        }

        ping();


    });
});

