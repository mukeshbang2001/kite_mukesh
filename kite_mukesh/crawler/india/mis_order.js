var fetch = require('node-fetch')
fetch("https://kite.zerodha.com/oms/orders/regular", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "authorization": "enctoken vOX9m8kYWlkTLM4RpBZyKeQrnMHoUgCKDy0S4vteZjkhZeX5f9atOUBScORA90s910njP0yFBmtBR2iUv2bILZvzbo9lsQ==",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-kite-userid": "YJ6753",
        "x-kite-version": "2.4.0",
        "cookie": "ext_name=ojplmecpdpgccookcobabopnaifgidhf; _ga=GA1.2.848594976.1583445657; kf_session=YwYFbT6bqyk4hiUkKBqrLpEuoiRjfN7o; user_id=YJ6753; __cfduid=ddc8607878ee956e85b2815a192d95f0a1587699971; public_token=fDLRoCnV0vDyvUK1zHMynG235RkHS9zV; enctoken=vOX9m8kYWlkTLM4RpBZyKeQrnMHoUgCKDy0S4vteZjkhZeX5f9atOUBScORA90s910njP0yFBmtBR2iUv2bILZvzbo9lsQ=="
    },
    "referrer": "https://kite.zerodha.com/orders",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "exchange=NSE&tradingsymbol=AUROPHARMA&transaction_type=SELL&order_type=SL-M&quantity=1&price=0&product=MIS&validity=DAY&disclosed_quantity=0&trigger_price=624.45&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753",
    "method": "POST",
    "mode": "cors"
}).then(r => {
    console.log("%j", r)
});




exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=MARKET&quantity=1200&price=0&product=MIS&validity=DAY&disclosed_quantity=0&trigger_price=0&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753
exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=LIMIT&quantity=1200&price=406&product=MIS&validity=DAY&disclosed_quantity=0&trigger_price=0&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753
exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=SL&quantity=1200&price=406&product=MIS&validity=DAY&disclosed_quantity=0&trigger_price=406&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753
exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=SL-M&quantity=1200&price=0&product=MIS&validity=DAY&disclosed_quantity=0&trigger_price=406&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753

exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=SL-M&quantity=1200&price=0&product=NRML&validity=DAY&disclosed_quantity=0&trigger_price=406&squareoff=0&stoploss=0&trailing_stoploss=0&variety=regular&user_id=YJ6753

exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=SL-M&quantity=1200&price=0&product=NRML&validity=DAY&disclosed_quantity=0&trigger_price=406&squareoff=0&stoploss=0&trailing_stoploss=0&variety=amo&user_id=YJ6753
exchange=NFO&tradingsymbol=AXISBANK20APRFUT&transaction_type=SELL&order_type=LIMIT&quantity=1200&price=406&product=NRML&validity=DAY&disclosed_quantity=0&trigger_price=0&squareoff=0&stoploss=0&trailing_stoploss=0&variety=amo&user_id=YJ6753