/*
*   <#CreateHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The MQTT handler for resource creation."@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugMqtt = require('debug')('solid-iot:mqtt')
intoStream = require('into-stream')
require('../IotUtils')
require('../validation/validator')


CreateHandler = function(program) {

    this.handle = async function(topic, message) {
        
		debugMqtt('topic: ' + topic)
		
		let topicParts = topic.split('/')
		let resourceID = '/' + topicParts[1]
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		let contentType = "text/turtle"
		
		// Validate Shacl
		var validator = new Validator()
		let isValid = validator.validateData(message)
			
		if (!isValid){
			debugMqtt('Not valid according to shacl shapes!');
			return
		}
		
		try {
		  await ldp.put(resourceID, intoStream(message), contentType)
		  debugMqtt('Succeded creating the resource ' + resourceID + ' with content:\n' + message)
		} catch (err) {
		  debugMqtt('Error creating the file:' + err.message)
		  err.message = 'Can\'t write file: ' + err.message
          return
		}
        
    }

}