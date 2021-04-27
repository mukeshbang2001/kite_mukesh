#!/usr/bin/env node
const request = require('request');
const util = require('util');
var queue = 'india-stocks';
var queue2 = 'stocks_algo';
var positions_queue = 'positions';

const schwab_options = {
    url: 'https://client.schwab.com/api/summary/positions',
    headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTE5NTM2MjYsInRva2VuIjoiUXlISGxleEptMTV2RnBFQTFWODNFT1FZQXJ4d3hJIiwidXNlcl9pZCI6IjQxZjkzZjY5LWVkZDctNDNjYi04NGMzLTQ5YzI5MzVjNzJlOCIsImRldmljZV9oYXNoIjoiN2UxYzA2OWI0NWYwOGNkOTM2NDhmMjY3ZWEyZDZkZjAiLCJzY29wZSI6ImludGVybmFsIiwiZGN0IjoxNTk0MDU2MjUwLCJ1c2VyX29yaWdpbiI6IlVTIiwib3B0aW9ucyI6dHJ1ZSwibGV2ZWwyX2FjY2VzcyI6ZmFsc2V9.YK0IGAibJq4L5TTjq-aP70kaD_Uz5MF0TvZua-YNOa8rA0qTEIOjghrRh1EH7KgLY3FkaJ_0qcpQ2IIb6ZlVpRpKGOuJ44AXMA4kpbqShKnSSzL08ma_2A5kOyIpJ9Zot3LEBBpqC6p7Sa6Sx7AKS5tK2Ean6IG1WZTnFT8lOFpfxGZ8RSML8AYsF5UPbyQYe_yU3_K1oO_JDuj29tkeGNZCqUcU0Gk7MCBpaddluMTBIWPPutQSaQbWUnpxOXIeNX_nexaQTnKgVNZ7ob4fPqsOQ271_ZAb7-xfysUhxhwG4sOESW3HQ7m_rXQKJgGT5_cTvYL414PSPyZ6D8dbEw"
    }
};

var stockMap = {
    // 'msft': '50810c35-d215-4866-9758-0ada4ac79ffa',
    // 'nflx':'81733743-965a-4d93-b87a-6973cb9efd34',

    // 'zm': '35875944-ffb7-47eb-a2e5-582ba9f26a8d',
    // 'crm':'cf1d849d-06f7-4374-9e84-13129713d0c7',
    // 'bynd': 'aef7105d-8209-48e5-be1c-b9013206b0c9',
    // 'apple': '450dfc6d-5510-4d40-abfb-f633b7d9be3e',
    'tesla': 'e39ed23a-7bd1-4587-b060-71988d9ef483',
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
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTc5OTk3NDUsInRva2VuIjoiWVVtMlFXbmd0SW5jc3dPSDhwdXpVT0FuNHh3d1VCIiwidXNlcl9pZCI6IjQxZjkzZjY5LWVkZDctNDNjYi04NGMzLTQ5YzI5MzVjNzJlOCIsImRldmljZV9oYXNoIjoiN2UxYzA2OWI0NWYwOGNkOTM2NDhmMjY3ZWEyZDZkZjAiLCJzY29wZSI6IndlYl9saW1pdGVkIiwiZGN0IjoxNTk0MDU2MjUwLCJzZXJ2aWNlX3JlY29yZHMiOlt7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJicm9rZWJhY2tfdXMiLCJzaGFyZF9pZCI6Niwic3RhdGUiOiJhdmFpbGFibGUifV0sInVzZXJfb3JpZ2luIjoiVVMiLCJvcHRpb25zIjp0cnVlLCJsZXZlbDJfYWNjZXNzIjpmYWxzZX0.GhF2M1bQ8aST3P5Xt2ToGR9JVO2tNN9SsVmAVd6hnQF0js_QHZv9ZbZisH5X7bPRCBjhxJ1PiE6lT4GfjwqioPniPvThRGlCt_7ETNL3nywGDTDISSjZbLHdwFM_P62-j568fwBsggwDjUiJfVYPxs7Ewo457ZYBfxHBnWZ3Qj0qbOPybaHHHirGDScRJAU-9MkjfwwcrcikJ3DULY42LybqjnU7bRb9SPA0EWj_HiSKQFU0M1uAF-O6AvEhQePzWHhpYsI-u9bgShL0RyOMUqn2qBtrZSORd574yWu2K1V7oB_va8nTCsGMhSpOpJlB-nSV-Crr0zZGzKjdtuYaMQ',
        'authority': 'api.robinhood.com'
    }
};

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: false
        });
        channel.assertQueue(queue2, {
            durable: false
        });

        function positionsUpdate() {
            request(schwab_options, function (err, response, body) {
                if (!body) return;
                var positionsObj = JSON.parse(body)['SecurityGroupings'].filter(item => item["GroupName"] == 'Option')[0]

                var output = {}

                output['totalMarketVal'] = positionsObj.Totals.MarketValue;
                output['Cost'] = positionsObj.Totals.Cost;
                output['DayChangeDollar'] = positionsObj.Totals.DayChangeDollar;
                var positions = [];
                positionsObj.Positions.forEach(position => {
                    positions.push({
                        "Key": position.ShortDescription,
                        "Val": {
                            Price: position.Accounts[0].Price,
                            Qnty: position.Accounts[0].Quantity
                        }
                    })
                })

                output['positions'] = positions;
                channel.sendToQueue(positions_queue, Buffer.from(JSON.stringify(output)));
                console.log("sent positions output: %j", output)

            })

            setTimeout(positionsUpdate, 3000)
        }

        function ping() {
            request(options, function (err, response, body) {
                console.log("error : %s", err);
                console.log("body : %s", body);

                if (!body) return;
                JSON.parse(body).results.forEach(obj => {
                    console.log("Obj: %j", obj)
                    if (!obj) return;
                    var prev_close = obj.previous_close;
                    var percentChange = 100 * (obj.last_trade_price - obj.previous_close) / obj.previous_close;
                    var msg = {"stockName": obj.symbol, "instrument": obj.symbol, "value": obj.last_trade_price};
                    var msg = {
                        "stockName": obj.symbol,
                        "instrument": obj.symbol,
                        "value": obj.last_trade_price,
                        "prevClose": prev_close,
                        "percentChange": percentChange
                    };
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                    channel.sendToQueue(queue2, Buffer.from(JSON.stringify(msg)));
                    console.log(" [x] Sent %s", msg);
                    if (obj.symbol == 'QQQ') {
                        var msg = {
                            "stockName": "NDX",
                            "instrument": obj.symbol + "*41",
                            "value": obj.last_trade_price * 41,
                            "prevClose": prev_close * 41,
                            "percentChange": percentChange
                        };
                        channel.sendToQueue(queue2, Buffer.from(JSON.stringify(msg)));
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
        // positionsUpdate();

    });
});

/**
 *  Sell Crypto curr
 *
 *

 fetch("https://nummus.robinhood.com/orders/", {
    "headers": {
        "accept": "* /*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTQwMjE1MTcsInRva2VuIjoib2w1Q1VMbWVibUZWMUdLcjh1WnM0TVZyVWJvTHU1IiwidXNlcl9pZCI6IjQxZjkzZjY5LWVkZDctNDNjYi04NGMzLTQ5YzI5MzVjNzJlOCIsImRldmljZV9oYXNoIjoiN2UxYzA2OWI0NWYwOGNkOTM2NDhmMjY3ZWEyZDZkZjAiLCJzY29wZSI6ImludGVybmFsIiwiZGN0IjoxNTk0MDU2MjUwLCJzZXJ2aWNlX3JlY29yZHMiOlt7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJicm9rZWJhY2tfdXMiLCJzaGFyZF9pZCI6Niwic3RhdGUiOiJhdmFpbGFibGUifV0sInVzZXJfb3JpZ2luIjoiVVMiLCJvcHRpb25zIjp0cnVlLCJsZXZlbDJfYWNjZXNzIjp0cnVlfQ.tuRFFpHaBMU6NaFGzFsYuHOWXnt5hgyhP4qgRu0C3nLE0nzoLXfYOM8VYNYbsBYpJ7XkOQ4lwrc56FxSwNPN-7WjN1ZPKFMR87LZpC3uP2g1NsJhLbjhcN3GVKlIDvp4wdIRBUjCIRH1kL9ncZde0UZo7FGUsH9YndTT7HPlrFTudwgbt_05k4NjglDjjcAEb7LY-3kTvq95_KODF-sPe_xWR4-JV3I_2z-QaTiHmgb2XtcU8ygOUiYN8AMYpsG-8HKXPOmcMFm1z1SKmuyc5BjPCA1_T783sg3jCh_bYajLeajJcUVtVPOTdtEUPZec-sS3ikhzpFjlCquuvxOg6g",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-timezone-id": "America/Los_Angeles"
    },
    "referrer": "https://robinhood.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"account_id\":\"f07be648-442c-48a5-8eb5-15ce8e1fb34b\",\"currency_pair_id\":\"1ef78e1b-049b-4f12-90e5-555dcf2fe204\",\"price\":\"0.053054\",\"quantity\":\"17\",\"ref_id\":\"bf145e21-9f79-4c9b-9400-0c1e9c6eead5\",\"type\":\"market\",\"side\":\"sell\",\"time_in_force\":\"gtc\"}",
    "method": "POST",
    "mode": "cors"
});


 Res:
 v = {
    "account_id": "f07be648-442c-48a5-8eb5-15ce8e1fb34b",
    "average_price": null,
    "cancel_url": "https://nummus.robinhood.com/orders/602a33ce-87aa-4774-8b0e-5dc6cd4229bb/cancel/",
    "created_at": "2021-02-15T03:41:50.778012-05:00",
    "cumulative_quantity": "0.000000000000000000",
    "currency_pair_id": "1ef78e1b-049b-4f12-90e5-555dcf2fe204",
    "executions": [],
    "id": "602a33ce-87aa-4774-8b0e-5dc6cd4229bb",
    "last_transaction_at": null,
    "price": "0.053054000000000000",
    "quantity": "17.000000000000000000",
    "ref_id": "bf145e21-9f79-4c9b-9400-0c1e9c6eead5",
    "rounded_executed_notional": "0.00",
    "side": "sell",
    "state": "unconfirmed",
    "time_in_force": "gtc",
    "type": "market",
    "updated_at": "2021-02-15T03:41:50.778037-05:00"
}
 */

/**

 fetch("https://api.robinhood.com/orders/", {
  "headers": {
    "accept": "* /*",
"accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2MTQwMjE1MTcsInRva2VuIjoib2w1Q1VMbWVibUZWMUdLcjh1WnM0TVZyVWJvTHU1IiwidXNlcl9pZCI6IjQxZjkzZjY5LWVkZDctNDNjYi04NGMzLTQ5YzI5MzVjNzJlOCIsImRldmljZV9oYXNoIjoiN2UxYzA2OWI0NWYwOGNkOTM2NDhmMjY3ZWEyZDZkZjAiLCJzY29wZSI6ImludGVybmFsIiwiZGN0IjoxNTk0MDU2MjUwLCJzZXJ2aWNlX3JlY29yZHMiOlt7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJicm9rZWJhY2tfdXMiLCJzaGFyZF9pZCI6Niwic3RhdGUiOiJhdmFpbGFibGUifV0sInVzZXJfb3JpZ2luIjoiVVMiLCJvcHRpb25zIjp0cnVlLCJsZXZlbDJfYWNjZXNzIjp0cnVlfQ.tuRFFpHaBMU6NaFGzFsYuHOWXnt5hgyhP4qgRu0C3nLE0nzoLXfYOM8VYNYbsBYpJ7XkOQ4lwrc56FxSwNPN-7WjN1ZPKFMR87LZpC3uP2g1NsJhLbjhcN3GVKlIDvp4wdIRBUjCIRH1kL9ncZde0UZo7FGUsH9YndTT7HPlrFTudwgbt_05k4NjglDjjcAEb7LY-3kTvq95_KODF-sPe_xWR4-JV3I_2z-QaTiHmgb2XtcU8ygOUiYN8AMYpsG-8HKXPOmcMFm1z1SKmuyc5BjPCA1_T783sg3jCh_bYajLeajJcUVtVPOTdtEUPZec-sS3ikhzpFjlCquuvxOg6g",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
},
"referrer": "https://robinhood.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"ref_id\":\"04ebd1a4-98c7-44ca-af04-4a46de157961\",\"account\":\"https://api.robinhood.com/accounts/742858392/\",\"instrument\":\"https://api.robinhood.com/instruments/29d287a3-771b-4414-95ed-8669423303bf/\",\"symbol\":\"UBER\",\"quantity\":\"0.015479\",\"side\":\"buy\",\"type\":\"market\",\"trigger\":\"immediate\",\"time_in_force\":\"gfd\",\"extended_hours\":false,\"price\":\"64.60\",\"dollar_based_amount\":{\"amount\":\"1.00\",\"currency_code\":\"USD\"}}",
    "method": "POST",
    "mode": "cors"
});



res = {
    "id": "0a399dbf-3e94-47e1-9808-b1b662ac68be",
    "ref_id": "04ebd1a4-98c7-44ca-af04-4a46de157961",
    "url": "https:\/\/api.robinhood.com\/orders\/0a399dbf-3e94-47e1-9808-b1b662ac68be\/",
    "account": "https:\/\/api.robinhood.com\/accounts\/742858392\/",
    "position": "https:\/\/api.robinhood.com\/positions\/742858392\/29d287a3-771b-4414-95ed-8669423303bf\/",
    "cancel": "https:\/\/api.robinhood.com\/orders\/0a399dbf-3e94-47e1-9808-b1b662ac68be\/cancel\/",
    "instrument": "https:\/\/api.robinhood.com\/instruments\/29d287a3-771b-4414-95ed-8669423303bf\/",
    "cumulative_quantity": "0.00000000",
    "average_price": null,
    "fees": "0.00",
    "state": "unconfirmed",
    "type": "market",
    "side": "buy",
    "time_in_force": "gfd",
    "trigger": "immediate",
    "price": "64.60000000",
    "stop_price": null,
    "quantity": "0.01547900",
    "reject_reason": null,
    "created_at": "2021-02-15T08:52:35.399545Z",
    "updated_at": "2021-02-15T08:52:35.399570Z",
    "last_transaction_at": "2021-02-15T08:52:35.399545Z",
    "executions": [],
    "extended_hours": false,
    "override_dtbp_checks": false,
    "override_day_trade_checks": false,
    "response_category": null,
    "stop_triggered_at": null,
    "last_trail_price": null,
    "last_trail_price_updated_at": null,
    "dollar_based_amount": {
        "amount": "1.00000000",
        "currency_code": "USD",
        "currency_id": "1072fc76-1862-41ab-82c2-485837590762"
    },
    "total_notional": {"amount": "1.00", "currency_code": "USD", "currency_id": "1072fc76-1862-41ab-82c2-485837590762"},
    "executed_notional": null,
    "investment_schedule_id": null,
    "is_ipo_access_order": false,
    "ipo_access_lower_collared_price": null,
    "ipo_access_upper_collared_price": null,
    "ipo_access_upper_price": null,
    "ipo_access_lower_price": null
}

 */
