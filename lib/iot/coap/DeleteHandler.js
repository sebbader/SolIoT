/*
*   <#DeleteHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for DELETE requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')
require('../IotUtils')


DeleteHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		
		try {
		  await ldp.delete(req.url)
		  debugCoap('DELETE -- Ok.\n' + req.url + ' successfully deleted.')
		  res.end('Deleted ' + req.url + ' successfully.')
		} catch (err) {
			if (err.status === 404) {
                debugCoap('CoAP DELETE -- Error: Can\'t find ' + req.url + '!')
                res.statusCode = err.status
                res.end('CoAP DELETE returned error: Can\'t find ' + req.url + '!')
                return
            } else {
                debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
                res.end('CoAP DELETE for ' + req.url + ' returned error: ' + err.message)
                return
            }
		}
        
    }

}