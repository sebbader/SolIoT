/*
*   <#UpdateHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The MQTT handler for Updates via PUT requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugMqtt = require('debug')('solid-iot:mqtt')
intoStream = require('into-stream')
require('../IotUtils')
require('../validation/validator')


UpdateHandler = function(program) {

    this.handle = async function(topic, message) {
        
		debugMqtt('topic: ' + topic)
		
		let topicParts = topic.split('/')
		let resourceID = '/' + topicParts[1]
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		try {
            resource = await ldp.readResource(resourceID).then(
				async function(resource){
					try{
						// Validate Shacl
						var validator = new Validator()
						let isValid = validator.validateData(resource + '\n' + message)
							
						if (!isValid){
							debugMqtt('Message is an invalid WoT Thing!');
							return
						}
						
						await ldp.put(resourceID, intoStream(resource + '\n' + message), contentType)
						debugMqtt('Succeded updating the resource ' + resourceID)
						debugMqtt(resource + '\n' + message)
					} catch (err) {
						debugMqtt('Error updating the file:' + err.message)
						err.message = 'Can\'t write file: ' + err.message
						return
					}
				}
				  
			)
        } catch (err) {
            if (err.status === 404) {
                debugMqtt('LDP returns 404')
                return 'MQTT ' + topicParts[topicParts.length - 1].toUpperCase() + ' -- Error: ' + err.status + ' ' + err.message
            } else {
                debugMqtt('MQTT ' + topicParts[topicParts.length - 1].toUpperCase() + ' -- Error: ' + err.status + ' ' + err.message)
                return
            }
        }

        
		
		
			
    }
	

}