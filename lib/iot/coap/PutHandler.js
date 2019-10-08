/*
*   <#PutHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for PUT requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')
require('../IotUtils')


PutHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		try {
		  await ldp.put(req.url, req, contentType)
		  debugCoap('Succeded putting the file')
		  res.end('CoAP PUT for ' + req.url + ' successful!')
		} catch (err) {
		  debug('Error putting the file:' + err.message)
		  err.message = 'Can\'t write file: ' + err.message
          res.statusCode = err.status
          res.end('CoAP PUT for ' + req.url + ':\n'+ err.message)
          return
		}
        
    }

}