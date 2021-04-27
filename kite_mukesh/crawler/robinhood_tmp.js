#!/usr/bin/env node
const request = require('request');
const util = require('util');
var queue = 'stocks_algo';


var stockMap = {
    // 'msft': '50810c35-d215-4866-9758-0ada4ac79ffa',
    // 'nflx':'81733743-965a-4d93-b87a-6973cb9efd34',

    // 'zm': '35875944-ffb7-47eb-a2e5-582ba9f26a8d',
    // 'crm':'cf1d849d-06f7-4374-9e84-13129713d0c7',
    // 'bynd': 'aef7105d-8209-48e5-be1c-b9013206b0c9',
    // 'apple': '450dfc6d-5510-4d40-abfb-f633b7d9be3e',
    'tesla':'e39ed23a-7bd1-4587-b060-71988d9ef483',
    // 'googl': '54db869e-f7d5-45fb-88f1-8d7072d4c8b2',
    // 'nvda':'a4ecd608-e7b4-4ff3-afa5-f77ae7632dfb',
     spy: '8f92e76f-1e0e-4478-8580-16a6ffcfaef5',
    dia: 'bab3b12b-4216-4b01-b2d8-9587ee5f41cf',

    QQQ: '1790dd4f-a7ff-409e-90de-cad5efafde10',
    // chain: '1c9d052c-165d-43a3-878d-3a0a0ca1ab49',
    // 'amzn':'c0bb3aec-bd1e-471e-a4f0-ca011cbec711',
    // 'cost': 'ec89803c-c5e5-4df1-889c-da4f8cb6f8cd',
    // 'shopify':'d05566bf-b0cc-414b-a520-b9216bb80abf'

}
var INSTRUMENT_URL = 'https://api.robinhood.com/instruments/%s/'


const options = {
    url: 'https://api.robinhood.com/marketdata/quotes/?bounds=trading&instruments=',
    headers: {
        'authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTU0MDcxMTIsInRva2VuIjoiRkhMR0JmWGk4czdlTlFHeXRyaTVlaXM1ZVZYUmlzIiwidXNlcl9pZCI6IjQxZjkzZjY5LWVkZDctNDNjYi04NGMzLTQ5YzI5MzVjNzJlOCIsImRldmljZV9oYXNoIjoiN2UxYzA2OWI0NWYwOGNkOTM2NDhmMjY3ZWEyZDZkZjAiLCJzY29wZSI6ImludGVybmFsIiwiZGN0IjoxNTk0MDU2MjUwLCJzZXJ2aWNlX3JlY29yZHMiOlt7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJicm9rZWJhY2tfdXMiLCJzaGFyZF9pZCI6Niwic3RhdGUiOiJhdmFpbGFibGUifV0sInVzZXJfb3JpZ2luIjoiVVMiLCJvcHRpb25zIjp0cnVlLCJsZXZlbDJfYWNjZXNzIjp0cnVlfQ.KHVprT-fsNasYiCG8R-owsKj1Pnt9rVaSxOrvUdmHTK1CZDpKUSxvnQYotLxyBml3nF-ZuR76MnfvWUT1Shm9JLAPsr9upnbUyRRilnLNFKDslbveWunsdVHGmLHclW5Hk6CoSzILNOyT9fS2FMJjgb6ZC--0ULnEN-mS-IzdOJTdgVJJMbNgvUtXCZ5hJ_fY5tmDVraT3t64HXwfYR3rr5zFoqPfNoGEJGGIHZZkRnOs4y9R4bVtQtU38eSFutlfCfTMLazV_BpzsXJ-Lu39gsi7uWp-E-jcunZrGl6U-daR_oCtrn0ndDZIK4TwCXKMvEDfA-WraFq3YiorOzh1g',
        'authority':'api.robinhood.com'
    }
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
                JSON.parse(body).results.forEach(obj => {
                    console.log("Obj: %j", obj)
                    if (!obj) return;
                    var prev_close = obj.previous_close;
                    var percentChange = 100*(obj.last_trade_price - obj.previous_close)/obj.previous_close;
                    var msg = {"stockName":obj.symbol,"instrument":obj.symbol,"value": obj.last_trade_price, "prevClose": prev_close, "percentChange": percentChange};
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                    console.log(" [x] Sent %s", msg);
                    if (obj.symbol == 'QQQ') {
                        var msg = {"stockName":"NDX","instrument":obj.symbol+ "*41","value": obj.last_trade_price*41, "prevClose": prev_close*41, "percentChange": percentChange};
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                        console.log(" [x] Sent %s", msg);
                    }


                })
            });

            setTimeout(ping, 1000);
        }

        // var list = ['fb', 'apple', 'tesla', 'msft']

        var instrumentString = Object.keys(stockMap).map(item => encodeURIComponent(util.format(INSTRUMENT_URL, stockMap[item]))).join();

        options.url += instrumentString
        ping();

    });
});
