const coap = require('coap')


callCoap = function() {
    var req = coap.request('coap://127.0.0.1:5683/profile/card#me');

    req.on('response', function(res) {
        res.pipe(process.stdout)
    })

    var result = req.end()
}

callCoap()