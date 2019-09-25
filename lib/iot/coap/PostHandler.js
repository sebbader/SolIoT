/*
*   <#PostHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for POST requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')
require('../IotUtils')


PostHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
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
          return
		}

		  // Check if container is a directory
		  if (stats && !stats.isDirectory()) {
			debug('Path is not a container, 405!')
			debugCoap('Path is not a container, 405!')
            res.statusCode = err.status
            res.end('CoAP POST for ' + req.url + ': Requested resource is not a container.')
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
		  { slug, extension, container: isBasicContainer, contentType }).then(
		  resourcePath => {
			debugCoap('File stored in ' + resourcePath)
		  })
		
        console.log(req.url)
        res.end('CoAP POST for ' + req.url + '\n with payload: \n' + req.payload)
        
    }

}