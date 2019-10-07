/*
*   <#evalUtils> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "Utils for SOLIOT evaluation"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/



const LDP = require('./iotUtils')
var request = require('request');
const debug = require('../debug')

EvalUtils = function(program) {
    
    this.sendEval = function(payload) {
        var iotUtils = new IotUtils()
        var argv = iotUtils.getArgv(program)
        var host = argv.evalserver

        debug.eval("Sending to eval server: " + JSON.stringify(payload))
        
        request.post(host, 
            payload,
            function (error, response, body) {
                if (error || response.statusCode != 200) {
                    console.log("Eval server responds with " + response.statusCode + ": " + body);
                }
            }
        );
    }

}