var instruments = {
    BAJFINANCE: "a|b"
}

var cashInstrumentsNse = {
    vix: 264969,
	ZEEL: 975873,
	IRCTC:3484417,
	BAJAJFINS:4268801,
	MINLIM:3675137,
    ZOMATO: 1304833,
	SRF:837889,NIFTY : 256265,
    TATASTEEL: 895745,
    BANKNIFTY : 15665922,
    //Finance & Banks
    ADANIENT:6401,
    SBIN: 779521,
    HINDALCO: 348929
}

// AUROPHARMA20APRFUT

// Current month expiry.. Format : <TradingSymbol><2-digityear><3-digit month>FUT
var futInstrumentsMap = {
    NIFTY20D1013100PE:11091714,
    NIFTY20D1013200PE:11092226,

    NIFTY: 15670018,
    BANKNIFTY: 15665922,
    ADANIENT: 13615362,
    BAJFINANCE: 13619202
}

options_instrument = {

}

module.exports.cashInstrumentsNse = cashInstrumentsNse;
module.exports.futInstrumentsMap = futInstrumentsMap;