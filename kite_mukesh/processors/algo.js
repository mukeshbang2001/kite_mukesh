#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const popup = require('node-popup/dist/cjs.js');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'stocks_algo';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

            var stockName = msg.content.stockName;
            var price = msg.content.value;

        }, {
            noAck: true
        });

    });
});
