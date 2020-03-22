/*
*   <#GetHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for GET requests"@en ;
*       <http://schema.org/author> https://sebastianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')
require('../IotUtils')


CoapGetHandler = function(program) {

    this.handle = async function(req, res) {
        
        debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		try {
            resource = await ldp.readResource(req.url)
        } catch (err) {
            if (err.status === 404) {
                debugCoap('LDP returns 404')
                res.statusCode = err.status
                res.end('CoAP GET for ' + req.url + ' not found.')
                return
            } else {
                debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
                res.end('CoAP GET for ' + req.url + ' returned error: ' + err.message)
                return
            }
        }

        debugCoap(resource)
        res.end('CoAP GET for ' + req.url + '\n' +resource)
        
    }

}