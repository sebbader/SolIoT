/*
*   <#PutHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for PUT requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')
require('../IotUtils')
require('../validation/validator')


PutHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		// Validate Shacl
		var validator = new Validator()
		let isValid = validator.validateData(req.payload.toString())

		if (!isValid){
			debugCoap('Message was an invalid WoT Thing according to shacl shapes!');
			res.end('CoAP PUT for ' + req.url + ': Message is an invalid WoT Thing!.')
			return
		}
		
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