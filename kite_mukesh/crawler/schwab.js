const request = require('request');



const options = {
    url: 'https://client.schwab.com/api/summary/positions',
    "headers": {
        "accept": "application/json, text/plain, */*",
        "cookie": "auth=D8B16F7D3E097D502CA33523CA1D05951ED201267D64FA875A9A1D71A05D56B81480ED2D81EDB80FA8CF0D720D367072CCE13DFA26CD3F274534C94E0C6A4F8B2EDF98908534F314C89A0DB4EE94A047B02A472BCDA3FA0E1A8E86002699B93A8407241DF7FAFE58E0E0C5A3837F2BD4361C79E409EC2383D554D4AFCE3D3496DB95FB73EC21A3694F4C4973DBA061DBA3AA083F04364C507B65773A5641E78C778AF349DCF06B45EDC4612DC579C79C996479BC9DB4F8754F3F7ECA741B31E511768A22E23FAFE2FD43B5F35868AA36DA4F8183B0272B5AA3B7B139D7A34B2DAA92A3D759B5192060E54AD3A7074DEEF2A972DCE60C90F94AED15269B0D7B92ADD92BE00FC7F19FDFFF3E8C13AD3FF153EC167D7A0C1F8AE40E497B1AC501A0FF09FCAE87B786890BC8CA86891CFD15959E52F7CA388322D2DEAE8761AE47EB427BD2FC;"
    }
};

request(options, function (err, response, body) {
    if(!body) return;
    var positionsObj = JSON.parse(body)['SecurityGroupings'].filter(item => item["GroupName"] == 'Option')[0]

    var output = {}

    output['totalMarketVal'] = positionsObj.Totals.MarketValue;
    output['Cost'] =  positionsObj.Totals.Cost;
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
    console.log("output: %j", output)
})
/*

fetch("", {
    "referrer": "https://client.schwab.com/clientapps/accounts/summary/",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
});*/
