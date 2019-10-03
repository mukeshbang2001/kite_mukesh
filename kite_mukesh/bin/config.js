var api_key = "9m8c1h4204ukmsh1",
    secret = "mngwf761xmyj8txgnko7e1pq3ot68yyb",
    request_token = "Uw3qNAfhtSp688B7gtAzLp27g10tzSvq", // get from login url // https://kite.zerodha.com/connect/login?api_key=<api_key>
    access_token = "lpAKXztphpAH43md2ugW7BYr3MBogAxs"; // to be generated from login URL

var instrumentsForTicks = []

module.exports.api_key = api_key
module.exports.secret = secret
module.exports.request_token = request_token
module.exports.access_token = access_token


// tradingSymbol -> lot
module.exports.lotsMap = {
    "NIFTY19OCTFUT":75,
    "BANKNIFTY19SEPFUT" : 20
}

module.exports.instrument_token_map = {
    NIFTY19OCTFUT: 13177346,
    BANKNIFTY19OCTFUT: 13176834,

    NIFTY19OCT11400PE: 13906690,
    NIFTY19O0311500PE: ''

}

module.exports.list_of_trading_symbols = [
    'NFO:NIFTY19OCTFUT',
    // 'NIFTY19O0311500PE',

    // 'BANKNIFTY19OCTFUT',

    // 'BAJAJFINSV19OCTFUT',
    'BAJFINANCE19OCTFUT'

    // 'TITAN19OCTFUT',
    // 'ASIANPAINT19OCTFUT',
    // 'HAVELLS19OCTFUT'
]
module.exports.instrument_stockName_map = {

}