/**
 * 
 */

const coap = require('coap')
	
module.exports = function () {
	var server = coap.createServer()
	
	server.on('request', function(req, res) {
	  res.end('Hello ' + req.url.split('/')[1] + '\n')
	})
	
	// the default CoAP port is 5683
	server.listen(683, function() {
	  var req = coap.request('coap://localhost:683/Sebastian')
	
	  req.on('response', function(res) {
	    res.pipe(process.stdout)
	    res.on('end', function() {
	      //process.exit(0)
	    })
	  })
	
	  req.end()
	})
}