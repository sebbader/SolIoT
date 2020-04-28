/*
*   <#PutHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for PUT requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
require('../../../bin/lib/mqtt')
const IotUtils = require('../IotUtils')
const EvalUtils = require('../EvalUtils')



PutHandler = function(program) {


    this.handle = async function(req, res) {
		
		var start = new Date()
		debugCoap(req.url)
        
        var iotUtils = new IotUtils()
        var evaluation = new EvalUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		try {
			var body = Buffer.from(req.payload).toString()

			await ldp.put(req.url, iotUtils.bufferToStream( req.payload ), contentType)

			var mqttClient = new MQTT()
			mqttClient.publishUpdate(req.url, body, function(){})
			
			var end = new Date()
			evaluation.sendEval({
				"soliot-server-coap-put-started-at": start,
				"soliot-server-coap-put-finised-at": end,
				"soliot-server-coap-put-duration": end - start,
				"soliot-server-coap-put-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-put-response-size": res.length
			})

			debugCoap('Succeded putting the file')
			res.statusCode = "2.04"
			res.end('CoAP PUT for ' + req.url + ' successful!') //
		} catch (err) {
			debugCoap('Error putting the file:' + err.message)
			err.message = 'Can\'t write file: ' + err.message
			res.statusCode = "4.00"
			res.end('CoAP PUT for ' + req.url + ':\n'+ err.message)
			var end = new Date()

			evaluation.sendEval({
				"soliot-server-coap-put-started-at": start,
				"soliot-server-coap-put-finised-at": end,
				"soliot-server-coap-put-duration": end - start,
				"soliot-server-coap-put-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-put-response-size": res.length
			})
			
			return
		}
        
    }

}





