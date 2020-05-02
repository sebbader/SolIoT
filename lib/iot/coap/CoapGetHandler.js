/*
*   <#GetHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for GET requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/
const translate = require('../../utils.js').translate
const RDFs = require('../../ldp').mimeTypesAsArray()

const debugCoap = require('debug')('soliot:coap')
const IotUtils = require('../IotUtils')
const EvalUtils = require('../EvalUtils')


//
const fs = require('fs')
const glob = require('glob')
const _path = require('path')
const $rdf = require('rdflib')
const Negotiator = require('negotiator')
//const mime = require('mime-types')

const debug = require('debug')('soliot:get')
const debugGlob = require('debug')('soliot:glob')
//const allow = require('./allow')
//




CoapGetHandler = function(program) {

    this.handle = async function(req, res) {
/*        
        var start = new Date()

        debugCoap(req.url)
        
        var iotUtils = new IotUtils()
        var ldp = iotUtils.getLDP(program)
        
        const baseUri = ldp.resourceMapper.resolveUrl(req.hostname, req.path)
        var requestedType

        let resource
		try {
            var options = req.options
            if (options && options.securityToken) {

                var checker = new DATChecker()
                if (!checker.isValid(DAT)) {
                    throw new error(4.01, 'Unauthorized')
                }
            }
            
//            for (var i = 0; i < req.options.length; i++) {
//                pathname += "/" + Buffer.from(req.options[i].value).toString()
//            }
            requestedType = (req.headers && req.headers.Accept)? req.headers.Accept : "application/ld+json"
            if(requestedType.includes("json")) requestedType = "application/ld+json"

            var ldpoptions = {
                hostname: baseUri,
                pathname:  req.url,
                includeBody: false,
                contentType: requestedType
              };
            let contentType
            
            resource = await ldp.get(ldpoptions, false)

            /*({ path, contentType } = await ldp.resourceMapper.mapUrlToFile(ldpoptions))
            stats = await ldp.stat(path)
            if (resource.container) {
                resource = await ldp.readContainerMeta(req.url)
            } else {
                resource = await ldp.readResource(req.url)
            }*/
/*
        } catch (err) {
            if (err.status === 404) {
                debugCoap('LDP returns 404')
                res.statusCode = "4.04"
                res.end('CoAP GET for ' + req.url + ' not found.')
                sendCoapGetEval(start, req, res)
                return
            } else {
                debugCoap(req.method + ' -- Error: ' + err.status + ' ' + err.message)
                res.statusCode = "4.00"
                res.end('CoAP GET for ' + req.url + ' returned error: ' + err.message)
                sendCoapGetEval(start, req, res)
                return
            }
        }

        let stream
        let contentType
      
        if (resource) {
          stream = resource.stream
          contentType = resource.contentType
        }

        
        const data = await translate(stream, baseUri, contentType, requestedType)

        debugCoap(resource)
        res.statusCode = "2.05"
        res.setOption("Content-Format", contentType)
        res.end(data)
        sendCoapGetEval(start, req, res)
        
    }
*/




        //sba:
        var start = new Date()


        var iotUtils = new IotUtils()
        var ldp = iotUtils.getLDP(program)
        const includeBody = req.method === 'GET'
        const negotiator = new Negotiator(req)
        const baseUri = ldp.resourceMapper.resolveUrl(req.hostname, req.url)
        const path = req.url
        var requestedType = (req.headers && req.headers.Accept)? req.headers.Accept : "application/json"

        let possibleRDFType = requestedType // negotiator.mediaType(RDFs)
        if(possibleRDFType.includes("json")) possibleRDFType = "application/ld+json"

    // res.header('MS-Author-Via', 'SPARQL')
            
        // Set live updates
        if (ldp.live) {
            res.header('Updates-Via', ldp.resourceMapper.resolveUrl(req.hostname).replace(/^http/, 'ws'))
        }

        debug(req.url + ' on ' + req.hostname)

        const options = {
            'hostname': 'localhost', //req.hostname,
            'path': path,
            'includeBody': includeBody,
            'possibleRDFType': possibleRDFType,
            'range': req.headers.range,
            'contentType': req.headers.Accept
        }

        let ret
        try {
            ret = await ldp.get(options, false)
            //iotUtils.sendHttps(req, iotUtils.getArgv(EvalUtils.program), function(){})
        } catch (err) {
            // use globHandler if magic is detected
            if (err.status === 404 && glob.hasMagic(path)) {
                debug('forwarding to glob request')

                globHandler(req, res, next)

                res.statusCode = "4.04"
                res.end('CoAP GET for ' + req.url + ' not found.')
                
                sendCoapGetEval(start, req, res)
                return
            } else {
                debug(req.method + ' -- Error: ' + err.status + ' ' + err.message)

                res.statusCode = "4.00"
                res.end('CoAP GET for ' + req.url + ' not found: ' + err.message)

                sendCoapGetEval(start, req, res)
                return 
            }
        }

        let stream
        let contentType
        let container
        let contentRange
        let chunksize

        if (ret) {
            stream = ret.stream
            contentType = ret.contentType
            container = ret.container
            contentRange = ret.contentRange
            chunksize = ret.chunksize
        }

        // Till here it must exist
        if (!includeBody) {
            debug('HEAD only')

            res.statusCode = "2.05"
            res.setOption("Content-Format", contentType)
            res.end()

            sendCoapGetEval(start, req, res)
            return 
        }



            
        // If request accepts the content-type we found
        if (stream && contentType == req.headers.Accept) {
            res.setOption('Content-Type', contentType)
            if (contentRange) {
                const headers = { 'Content-Range': contentRange, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize }
                res.writeHead(206, headers)

                res.statusCode = "2.05"
                res.setOption("Content-Format", contentType)
                res.end(stream)

                sendCoapGetEval(start, req, res)
                return 
            } else {

                res.statusCode = "2.05"
                res.setOption("Content-Format", contentType)
                res.end(stream)

                sendCoapGetEval(start, req, res)
                return
            }
        }

        // If it is not in our RDFs we can't even translate,
        // Sorry, we can't help
        if (!possibleRDFType) {

            res.statusCode = "4.00"
            res.end('Cannot serve requested type: ' + contentType)

            sendCoapGetEval(start, req, res)
            return //next(error(406, 'Cannot serve requested type: ' + contentType))
        }

        try {
            // Translate from the contentType found to the possibleRDFType desired
            const data = await translate(stream, baseUri, contentType, possibleRDFType)
            debug(req.originalUrl + ' translating ' + contentType + ' -> ' + possibleRDFType)
            res.setOption("Content-Format", requestedType)
            res.statusCode = "2.05"
            res.end(data)
            sendCoapGetEval(start, req, res)
            return 
        } catch (err) {
            res.statusCode = "5.00"
            res.end('Error translating between RDF formats')
            debug('error translating: ' + req.originalUrl + ' ' + contentType + ' -> ' + possibleRDFType + ' -- ' + 500 + ' ' + err.message)
            sendCoapGetEval(start, req, res)
            return //next(error(500, 'Error translating between RDF formats'))
        }
    }


    function sendCoapGetEval (start, req, res) {
        var end = new Date()
        EvalUtils.program = program

        var evaluation = new EvalUtils()
        evaluation.sendEval({
            "soliot-server-coap-get-started-at": start,
            "soliot-server-coap-get-finised-at": end,
            "soliot-server-coap-get-duration": end - start,
            "soliot-server-coap-get-request-size": 4 // constant for coap messages
                + req._packet.token.length // token length can be read from message header
                + JSON.stringify(req.options).replace(/[\[\]\,\"]/g,'').length // measure the byte size of the options
                + 1  // constant for coap messages
                + req.payload.length, // add the payload length (already in bytes)
            "soliot-server-coap-get-response-size": 4 
                + res._packet.token.length
                + JSON.stringify(res._packet.options).replace(/[\[\]\,\"]/g,'').length
                + 1
        })
    }


    async function globHandler (req, res, next) {
    const { ldp } = req.app.locals

    // Ensure this is a glob for all files in a single folder
    // https://github.com/solid/solid-spec/pull/148
    const requestUrl = await ldp.resourceMapper.getRequestUrl(req)
    if (!/^[^*]+\/\*$/.test(requestUrl)) {
        evaluation.sendEval({"solid-server-get-time": new Date() - start}) //sba
        return next(error(404, 'Unsupported glob pattern'))
    }

    // Extract the folder on the file system from the URL glob
    const folderUrl = requestUrl.substr(0, requestUrl.length - 1)
    const folderPath = (await ldp.resourceMapper.mapUrlToFile({ url: folderUrl, searchIndex: false })).path

    const globOptions = {
        noext: true,
        nobrace: true,
        nodir: true
    }

    glob(`${folderPath}*`, globOptions, async (err, matches) => {
        if (err || matches.length === 0) {
        debugGlob('No files matching the pattern')
        //evaluation.sendEval({"solid-server-get-time": new Date() - start}) //sba
        return next(error(404, 'No files matching glob pattern'))
        }

        // Matches found
        const globGraph = $rdf.graph()

        debugGlob('found matches ' + matches)
        await Promise.all(matches.map(match => new Promise(async (resolve, reject) => {
            const urlData = await ldp.resourceMapper.mapFileToUrl({ path: match, hostname: req.hostname })
            fs.readFile(match, {encoding: 'utf8'}, function (err, fileData) {
                if (err) {
                debugGlob('error ' + err)
                return resolve()
                }
                // Files should be Turtle
                if (urlData.contentType !== 'text/turtle') {
                return resolve()
                }
                // The agent should have Read access to the file
                hasReadPermissions(match, req, res, function (allowed) {
                if (allowed) {
                    try {
                    $rdf.parse(fileData, globGraph, urlData.url, 'text/turtle')
                    } catch (parseErr) {
                    debugGlob(`error parsing ${match}: ${parseErr}`)
                    }
                }
                return resolve()
                })
            })
            })))

            const data = $rdf.serialize(undefined, globGraph, requestUrl, 'text/turtle')
            // TODO this should be added as a middleware in the routes
            res.setHeader('Content-Type', 'text/turtle')
            debugGlob('returning turtle')

            //evaluation.sendEval({"solid-server-get-time": new Date() - start}) //sba
            res.send(data)
            next()
        })
    }

    // TODO: get rid of this ugly hack that uses the Allow handler to check read permissions
    function hasReadPermissions (file, req, res, callback) {
    const ldp = req.app.locals.ldp

    if (!ldp.webid) {
        return callback(true)
    }

    const root = ldp.resourceMapper.resolveFilePath(req.hostname)
    const relativePath = '/' + _path.relative(root, file)
    res.locals.path = relativePath
    allow('Read')(req, res, err => callback(!err))
    }

}