const coap = require('coap')
const assert = require('chai').assert
const program = require('commander')

require('../../lib/iot/coap/CoapGetHandler')
require('../../lib/iot/coap/PostHandler')
require('../../lib/iot/coap/DeleteHandler')
require('../../lib/iot/coap/PutHandler')


describe('Test the CoAP Get Handler', function () {
    it('Should response with a valid LDP Resource', function (done) {

        /*
        // send a coap request to the already running server
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
        */

        coap.createServer(function(req, res) {            
            var getHandler = new CoapGetHandler(program)
            getHandler.handle(req, res)
        }).listen(function() {

            //var req = coap.request('coap://127.0.0.1:5683/profile/card#me');
            var stringToBuffer = function(string) { 
                return Buffer.from(string, 'utf8'); }
            var bufferToString = function(buffer) { 
                return buffer.toString(); }
            coap.registerOption('SecurityToken',stringToBuffer, bufferToString)
            var options = {
                securityToken: "ey"
            }
            var callObject = {
                hostname: 'localhost',
                port: '5683', // default
                method: 'GET', // default
                pathname: '/profile/card#me',
                options: options
            }
            var req = coap.request(callObject)
            //req.write(JSON.stringify(payload));
            req.end()


            assert(result)
        })
    
    })
})