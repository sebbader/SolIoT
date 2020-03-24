/*
*   <#evalUtils> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "Utils for SOLIOT evaluation"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/



const LDP = require('./IotUtils')
var request = require('request');
const debug = require('../debug')

EvalUtils = function(program) {
    
    this.sendEval = function(evalResult) {
        try {
            var iotUtils = new IotUtils()
            var argv = iotUtils.getArgv(program)
            var uri = argv.evalserver

            if(!iotUtils.isURL(uri) || !(typeof argv.evalkey === 'string')) throw new Error("Evaluation Server URI or Key are not properly set. Set parameter in config.json or use environment variable SOLIOT_EVALSERVER or SOLIOT_EVALKEY")
            evalResult = {...{'uri': argv.serverUri}, ...evalResult}
            var payload = {'json': evalResult, 'hmacHex': getHmac(argv.evalkey, JSON.stringify(evalResult))}

            debug.eval("Sending to eval server: " + JSON.stringify(payload))

            request.post({url: uri, json: payload},
                function (error, response, body) {
                    if (error.code === 'ETIMEDOUT') {
                         console.log("Eval server responds with a timeout.");
                    } else if (error || response.statusCode != 200) {
                        console.log("Eval server responds with " + response.statusCode + ": " + body);
                    }
                }
            );
        } catch (err) {
              debug.eval(err.status, err.message)
        }
    }


    getHmac = function(key, content) {
        var crypto = require('crypto')
        hmacHex = crypto.createHmac('sha256', key).update(content).digest('hex')

        return hmacHex
    }

}