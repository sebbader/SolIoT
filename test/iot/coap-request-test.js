const coap = require('coap')


callCoap = function() {
    
    var coapTiming = {
        ackTimeout:0.25,
        ackRandomFactor: 1.0,
        maxRetransmit: 3,
        maxLatency: 2,
        piggybackReplyMs: 10
    };
    coap.updateTiming(coapTiming);

    var req = coap.request('coap://127.0.0.1:5683/profile/card#me');

    req.on('response', function(res) {
        res.pipe(process.stdout)
    })

    var result = req.end()
}

callCoap()