/*
*   <#DeleteHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The MQTT handler for DELETE topics"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const debugMqtt = require('debug')('solid-iot:mqtt')
require('../IotUtils')


DeleteHandler = function(program) {

    this.handle = async function(topic, message) {
        
		debugMqtt(topic)
        
        var iotUtils = new IotUtils()
		var ldp = iotUtils.getLDP(program)
		
		let topicParts = topic.split('/')
		let topicUrl = '/' + topicParts.slice(1, topicParts.length - 1).join('/')
		debugMqtt(topicUrl)
		
		try {
		  await ldp.delete(topicUrl)
		  debugMqtt('DELETE -- Ok.\n' + topicUrl + ' successfully deleted.')
		} catch (err) {
			if (err.status === 404) {
                debugMqtt('MQTT DELETE -- Error: Can\'t find ' + topicUrl + '!')
                return
            } else {
                debugMqtt('MQTT ' + topicParts[topicParts.length - 1].toUpperCase() + ' -- Error: ' + err.status + ' ' + err.message)
                return
            }
		}
        
    }

}