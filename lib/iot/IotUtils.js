/*
*   <#IotUtils> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "Utils for CoAP and Mqtt requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/


const options = require('./../../bin/lib/options')
const path = require('path')
const { loadConfig } = require('../../bin/lib/cli-utils')
const ResourceMapper = require('../resource-mapper')
const LDP = require('../ldp')

const BufferStream = require('./bufferstream')

IotUtils = function() {
    

    this.getArgv = function(program) {

        var envVars = {}

        options
            .filter((option) => !option.hide)
            .forEach((option) => {
                  const configName = option.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                  const snakeCaseName = configName.replace(/([A-Z])/g, '_$1')
                  //const envName = `SOLID_${snakeCaseName.toUpperCase()}`
                  const envName = `SOLIOT_${snakeCaseName.toUpperCase()}`

                  let name = '--' + option.name
                  if (!option.flag) {
                    name += ' [value]'
                  }

                  if (process.env[envName]) {
                    const raw = process.env[envName]
                    const envValue = /^(true|false)$/.test(raw) ? raw === 'true' : raw
                    envVars[configName] = envValue
                  }
            })
        
        var argv = loadConfig(program, options)
        argv = {...argv, ...envVars}
        argv.resourceMapper = new ResourceMapper({
            rootUrl: argv.serverUri,
            rootPath: path.resolve(argv.root || process.cwd()),
            includeHost: argv.multiuser,
            defaultContentType: argv.defaultContentType
        })

        return argv
    }


    this.getLDP = function(program) {
        
        var argv = this.getArgv(program)
        
        return new LDP(argv)
        
    }


    this.isURL = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    }


    this.bufferToStream = function(buffer) {
        return new BufferStream(buffer)
    }

}
