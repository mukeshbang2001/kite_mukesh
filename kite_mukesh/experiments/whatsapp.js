// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'PN3e91fdb6f1d0c5d8e4c63ccf17026c12';
// const accountSid = 'AC852177a74851c1e1d7b218dff836088e';
const authToken = 'c1e0e88632ee8a495864154d3f1f02ec';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        // from: 'whatsapp:+14155238886',
        from: 'whatsapp:+15204367548',

        body: 'Its a test msg.. ',
        // to: 'whatsapp:+14254283307'
        to: 'whatsapp:+12065869934'
    })
    .then(message => console.log(message.sid));


// (334) 373-1587
// (520) 436-7548

// from: 'whatsapp:+14155238886',
//5204367548