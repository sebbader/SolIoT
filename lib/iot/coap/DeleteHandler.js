/*
*   <#DeleteHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for DELETE requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugCoap = require('debug')('solid-iot:coap')

const SolidHost = require('../../models/solid-host')

const deleteHandler = require('../../handlers/delete')
const options = require('../../../bin/lib/options')
const path = require('path')
const { loadConfig } = require('../../../bin/lib/cli-utils')
const ResourceMapper = require('../../resource-mapper')
const LDP = require('../../ldp')


DeleteHandler = function(program) {

    this.handle = async function(req, res) {
        
		debugCoap(req.url)
        
        options
            .filter((option) => !option.hide)
            .forEach((option) => {
                  const configName = option.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                  const snakeCaseName = configName.replace(/([A-Z])/g, '_$1')
                  const envName = `SOLID_${snakeCaseName.toUpperCase()}`

                  let name = '--' + option.name
                  if (!option.flag) {
                    name += ' [value]'
                  }

                  if (process.env[envName]) {
                    const raw = process.env[envName]
                    const envValue = /^(true|false)$/.test(raw) ? raw === 'true' : raw

                    //start.option(name, option.help, envValue)
                  } else {
                    //start.option(name, option.help)
                  }
            })

        var argv = loadConfig(program, options)
        argv.resourceMapper = new ResourceMapper({
            rootUrl: argv.serverUri,
            rootPath: path.resolve(argv.root || process.cwd()),
            includeHost: argv.multiuser,
            defaultContentType: argv.defaultContentType
        })
        
        var ldp = new LDP(argv)
		
		try {
		  await ldp.delete(req.url)
		  debugCoap('DELETE -- Ok.\n' + req.url + ' successfully deleted.')
		  res.end('Deleted ' + req.url + ' successfully.')
		} catch (err) {
			debugCoap('DELETE -- Failed to delete:\n' + err)
			res.end('Could not delete ' + req.url + '. Check if path is valid.')
		}
        
    }

}