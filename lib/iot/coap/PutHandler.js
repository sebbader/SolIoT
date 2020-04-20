/*
*   <#PutHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for PUT requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
require('../../../bin/lib/mqtt')
require('../IotUtils')



PutHandler = function(program) {


    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		try {
			var body = Buffer.from(req.payload).toString()

			await ldp.put(req.url, iotUtils.bufferToStream( req.payload ), contentType)

			var mqttClient = new MQTT()
			mqttClient.publishUpdate(req.url, body, function(){})

			debugCoap('Succeded putting the file')
			res.statusCode = "2.04"
			res.end('CoAP PUT for ' + req.url + ' successful!')
		} catch (err) {
			debugCoap('Error putting the file:' + err.message)
			err.message = 'Can\'t write file: ' + err.message
			res.statusCode = "4.00"
			res.end('CoAP PUT for ' + req.url + ':\n'+ err.message)
			return
		}
        
    }

}





