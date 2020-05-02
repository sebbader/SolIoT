/*
*   <#PostHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for POST requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
const IotUtils = require('../IotUtils')
const EvalUtils = require('../EvalUtils')


PostHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)

        //sba:
        var evaluation = new EvalUtils()
        var start = new Date()
		var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		
		
		// help variable
		let splittedUrl = req.url.split('/')
		
		// needed post vars:
		let hostname = ldp.serverUri
		let containerPath = splittedUrl.slice(0, splittedUrl.length - 1).join('/') + "/"
		let contentType = "text/turtle"
		let extension
		let link
		let isBasisContainer
		let slug
		
		// Check if container exists
		let stats
		try {
		  const ret = await ldp.exists(req.hostname, containerPath, false)
		  if (ret) {
		    stats = ret.stream
		  }
		} catch (err) {
			debugCoap('Container is not valid')
			res.statusCode = err.status
			res.end('CoAP POST for ' + req.url + ': Container not valid.')
		  
			// sba
            var end = new Date()
			evaluation.sendEval({
				"soliot-server-coap-post-started-at": start,
				"soliot-server-coap-post-finised-at": end,
				"soliot-server-coap-post-duration": end - start,
				"soliot-server-coap-post-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-post-response-size": res.length
			})

          	return
		}

		try {
			var body = Buffer.from(req.payload).toString()

			// Check if container is a directory
			if (stats && !stats.isDirectory()) {
				debug('Path is not a container, 405!')
				debugCoap('Path is not a container, 405!')
				res.statusCode = err.status
				res.end('CoAP POST for ' + req.url + ': Requested resource is not a container.')

				// sba
				var end = new Date()
				evaluation.sendEval({
					"soliot-server-coap-post-started-at": start,
					"soliot-server-coap-post-finised-at": end,
					"soliot-server-coap-post-duration": end - start,
					"soliot-server-coap-post-request-size": 4 // constant for coap messages
						+ req._packet.token.length // token length can be read from message header
						+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
						+ 1  // constant for coap messages
						+ req.payload.length, // add the payload length (already in bytes)
					"soliot-server-coap-post-response-size": res.length
				})

				return
			}
		
			// create file usage:
			// coap post coap://localhost:683/<path>/<to>/<file.ttl> -p "<RDF> <formated> <Information> ."
		
			// create container usage:
			// coap post coap://localhost:683/<path>/<to>/<container> -p "<RDF> <formated> <Meta-Information> ."
			
			if (splittedUrl[splittedUrl.length - 1].includes('.')){
				// Create a file
				let splittedFileName = splittedUrl[splittedUrl.length - 1].split(".")
				slug = splittedFileName.slice(0, splittedFileName.length - 1).join('.')
				extension = "." + splittedFileName[splittedFileName.length - 1]
				link = "<http://www.w3.org/ns/ldp#Resource>; rel='type'"
				isBasicContainer = false
			} else {
				// Create a container
				extension = ""
				slug = splittedUrl[splittedUrl.length - 1]
				link = "<http://www.w3.org/ns/ldp#BasicContainer>; rel='type'"
				isBasicContainer = true
			}
		

			ldp.post(hostname, containerPath, req,
				{ slug, extension, container: isBasicContainer, contentType })
			.then(resourcePath => {
					debugCoap('File stored in ' + resourcePath)
				})
			
			// sba
            var end = new Date()
			evaluation.sendEval({
				"soliot-server-coap-post-started-at": start,
				"soliot-server-coap-post-finised-at": end,
				"soliot-server-coap-post-duration": end - start,
				"soliot-server-coap-post-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-post-response-size": res.length
			})


			var mqttClient = new MQTT()
			mqttClient.publishCreated(req.url, body, function(){})

			debugCoap('Succeded creating the file')
			res.statusCode = "2.01"
			res.end('CoAP POST for ' + req.url + '\n with payload: \n' + req.payload)
		} catch (err) {
			debugCoap('Error creating the file:' + err.message)
			err.message = 'Can\'t write file: ' + err.message
			res.statusCode = "4.00"
			res.end('CoAP POST for ' + req.url + ':\n'+ err.message)

			// sba
            var end = new Date()
			evaluation.sendEval({
				"soliot-server-coap-post-started-at": start,
				"soliot-server-coap-post-finised-at": end,
				"soliot-server-coap-post-duration": end - start,
				"soliot-server-coap-post-request-size": 4 // constant for coap messages
					+ req._packet.token.length // token length can be read from message header
					+ JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
					+ 1  // constant for coap messages
					+ req.payload.length, // add the payload length (already in bytes)
				"soliot-server-coap-post-response-size": res.length
			})

			return
		}
        
    }

}