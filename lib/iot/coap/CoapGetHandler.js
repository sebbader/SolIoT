/*
*   <#GetHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for GET requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
const IotUtils = require('../IotUtils')
const EvalUtils = require('../EvalUtils')


CoapGetHandler = function(program) {

    this.handle = async function(req, res) {
        
        debugCoap(req.url)
        
        var iotUtils = new IotUtils()
        var ldp = iotUtils.getLDP(program)
        
        var evaluation = new EvalUtils()
        var start = new Date()

		try {
            var options = req.options
            if (options && options.securityToken) {

                var checker = new DATChecker()
                if (!checker.isValid(DAT)) {
                    throw new error(4.01, 'Unauthorized')
                }
            }
            
            
            const includeBody = true
            var pathname = ""
            for (var i = 0; i < req.options.length; i++) {
                pathname += "/" + Buffer.from(req.options[i].value).toString()
            }
            const content = "text/turtle"

            var ldpoptions = {
                'hostname': req.rsinfo.address,
                'pathname': pathname,
                'includeBody': includeBody,
                'contentType': content
              };
            
            ({ path, contentType } = await ldp.resourceMapper.mapUrlToFile({ url: ldpoptions, searchIndex: true }))
            stats = await ldp.stat(path)
            if (stats.isDirectory()) {
                resource = await ldp.readContainerMeta(req.url)
            } else {
                resource = await ldp.readResource(req.url)
            }
        } catch (err) {
            if (err.status === 404) {
                debugCoap('LDP returns 404')
                res.statusCode = "4.04"
                res.end('CoAP GET for ' + req.url + ' not found.')
                evaluation.sendEval({"soliot-server-coap-get-time": new Date() - start})
                return
            } else {
                debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
                res.statusCode = "4.00"
                res.end('CoAP GET for ' + req.url + ' returned error: ' + err.message)
                evaluation.sendEval({"soliot-server-coap-get-time": new Date() - start})
                return
            }
        }

        debugCoap(resource)
        res.statusCode = "2.05"
        res.end('CoAP GET for ' + req.url + '\n' +resource)
        evaluation.sendEval({"soliot-server-coap-get-time": new Date() - start})
        
    }

}