/*
*   <#GetHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for GET requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('soliot:coap')
require('../IotUtils')


CoapGetHandler = function(program) {

    this.handle = async function(req, res) {
        
        debugCoap(req.url)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		try {
            var options = req.options
            if (options && options.securityToken) {

                var checker = new DATChecker()
                if (!checker.isValid(DAT)) {
                    throw new error(4.01, 'Unauthorized')
                }
            }
            
            
            const includeBody = true
            const pathname = "/" + Buffer.from(req.options[0].value).toString()
            const content = "application/ld+json"

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
                return
            } else {
                debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
                res.statusCode = "4.00"
                res.end('CoAP GET for ' + req.url + ' returned error: ' + err.message)
                return
            }
        }

        debugCoap(resource)
        res.statusCode = "2.05"
        res.end('CoAP GET for ' + req.url + '\n' +resource)
        
    }

}