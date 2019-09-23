var api_key = "<api key>",
    secret = "<secret key>",
    request_token = "<req token, get from login url>", // login url https://kite.zerodha.com/connect/login?api_key=<api_key>
    access_token = "<access token generated frm generate_access_token_file>"; // to be generated from login URL

var instrumentsForTicks = []

module.exports.api_key = api_key
module.exports.secret = secret
module.exports.request_token = request_token
module.exports.access_token = access_token