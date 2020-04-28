/*
*   <#DeleteHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for DELETE requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
require('../../../bin/lib/mqtt')
const IotUtils = require('../IotUtils')
const EvalUtils = require('../EvalUtils')


DeleteHandler = function(program) {

    this.handle = async function(req, res) {

    debugCoap(req.url)

    var evaluation = new EvalUtils()
    var start = new Date()
    var iotUtils = new IotUtils()
    var ldp = iotUtils.getLDP(program)

    try {
      await ldp.delete(req.url)
      var mqttClient = new MQTT()
			mqttClient.publishDelete(req.url, function(){})

      debugCoap('DELETE -- Ok.\n' + req.url + ' successfully deleted.')
      res.statusCode = "2.02"
      
      var end = new Date()
			evaluation.sendEval({
				"soliot-server-coap-delete-started-at": start,
				"soliot-server-coap-delete-finised-at": end,
				"soliot-server-coap-delete-duration": duration,
				"soliot-server-coap-delete-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-delete-response-size": res.length
			})

      res.end('Deleted ' + req.url + ' successfully.')
    } catch (err) {
      if (err.status === 404) {
            debugCoap('CoAP DELETE -- Error: Can\'t find ' + req.url + '!')
            res.statusCode = "4.04"
            res.end('CoAP DELETE returned error: Can\'t find ' + req.url + '!')
            
            var end = new Date()
            evaluation.sendEval({
              "soliot-server-coap-delete-started-at": start,
              "soliot-server-coap-delete-finised-at": end,
              "soliot-server-coap-delete-duration": duration,
              "soliot-server-coap-delete-request-size": 4 // constant for coap messages
                + req._packet.token.length // token length can be read from message header
                + JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
                + 1  // constant for coap messages
                + req.payload.length, // add the payload length (already in bytes)
              "soliot-server-coap-delete-response-size": res.length
            })

            return
        } else {
            debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
            res.statusCode = "4.00"
            res.end('CoAP DELETE for ' + req.url + ' returned error: ' + err.message)

            var end = new Date()
            evaluation.sendEval({
              "soliot-server-coap-delete-started-at": start,
              "soliot-server-coap-delete-finised-at": end,
              "soliot-server-coap-delete-duration": duration,
              "soliot-server-coap-delete-request-size": 4 // constant for coap messages
                + req._packet.token.length // token length can be read from message header
                + JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
                + 1  // constant for coap messages
                + req.payload.length, // add the payload length (already in bytes)
              "soliot-server-coap-delete-response-size": res.length
            })

            return
        }
      }
    }

}