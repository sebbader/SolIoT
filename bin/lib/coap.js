/**
 * 
 */

const coap = require('coap')
require('../../lib/iot/coap/CoapGetHandler')
require('../../lib/iot/coap/PostHandler')
require('../../lib/iot/coap/DeleteHandler')
require('../../lib/iot/coap/PutHandler')

require('../../lib/iot/EvalUtils')

    
module.exports = function (program) {
    var server = coap.createServer()
    
	var iotUtils = new IotUtils()
	var argv = iotUtils.getArgv(program)
    
    var getHandler = new CoapGetHandler(program)
    var postHandler = new PostHandler(program)	
	var deleteHandler = new DeleteHandler(program)
	var putHandler = new PutHandler(program)
    
    // add handlers for CoAP methods
    server.on('request', function(req, res) {
        if (req.method == "GET") {
            //console.log('CoAP GET: ' + req.url)
            getHandler.handle(req, res)
            //res.end('Responding with: messageGet');
        }
        else if (req.method == "PUT") {
            //console.log('CoAP PUT: ' + req.url)
            putHandler.handle(req, res)
			//res.end('Responding with: messagePut');
        }
        else if (req.method == "POST") {
            //console.log('CoAP POST: ' + req.url)
            postHandler.handle(req, res)
            //res.end('Responding with: messagePost');
        }
        else if (req.method == "DELETE") {
            //console.log('CoAP DELETE: ' + req.url)
            deleteHandler.handle(req, res)
			//res.end('Responding with: messageDelete');
        }
      //res.end('GET - CoAP says: Hello ' + req.url.split('/')[1] + '\n')
    })
    
    // the default CoAP port is 5683
    server.listen(argv.coapPort, function() {
        console.log('CoAP server listens at port ' + argv.coapPort + '.')
        var req = coap.request('coap://localhost:' + argv.coapPort + '/profile/card#me')

	  // SOLIOT evaluation
	  var start = new Date()
    
      req.on('response', function(res) {
        res.pipe(process.stdout)
        res.on('end', function() {
			//process.exit(0)

			// SOLIOT evaluation
			var time = new Date() - start;
			var evaluation = new EvalUtils(program)
			evaluation.sendEval({"coap-reuest-time": time})
        })
      })

      // TODO add handlers
    
      req.end()
      
    })
    
/*
    server.listen(5683/*, function(req, resp) {
        //resp.setOption("555", [new Buffer('CoAP says: Hello ' + req.url.split('/')[1] + '\n')])
        resp.end('CoAP says: Hello ' + req.url.split('/')[1] + '\n')
    }
    )*/
    
    /*
    var server = coap.createServer();
    server.on('request', function(req, res) {
        if (req.url == "/test-resource" && req.method == "GET") {
            res.end('messageGet');
        }
        if (req.url == "/test-resource" && req.method == "PUT") {
            res.end('messagePut');
        }
        if (req.url == "/test-resource" && req.method == "POST") {
            res.end('messagePost');
        }
        if (req.url == "/test-resource" && req.method == "DELETE") {
            res.end('messageDelete');
        }
    });
    server.listen(5683, function() {
        console.log('Test CoAP Server Started');
    });
    */
}