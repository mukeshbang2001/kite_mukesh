package stock;

/*
Ticks: [ { tradable: true,
    mode: 'full',
    instrument_token: 738561,
    last_price: 1296.8,
    last_quantity: 500,
    average_price: 1293.24,
    volume: 8389212,
    buy_quantity: 0,
    sell_quantity: 24529,
    ohlc: { open: 1292, high: 1298.8, low: 1283.5, close: 1279.55 },
    change: 1.3481302020241492,
    last_trade_time: 2019-09-26T10:29:18.000Z,
    timestamp: 2019-09-26T11:03:38.000Z,
    oi: 0,
    oi_day_high: 0,
    oi_day_low: 0,
    depth: { buy: [Array], sell: [Array] } } ]
 */

public class Tick {

    String instrument_token;
    double last_price;
    double last_quantity;
    double volume;
    double change;
    int oi;
    String timestamp;

    OHLC ohlc;

}
