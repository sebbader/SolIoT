/**
 * 
 */

var mqtt = require('mqtt')

module.exports = function () {
	var client  = mqtt.connect('mqtt://localhost:1883')
//	var client  = mqtt.connect('mqtt://test.mosquitto.org')
	 
	client.on('connect', function () {
		
		client.subscribe('solid', function (err) {
			
			if (!err) {
				console.log('Successfully subscribed to topic "solid"')
				client.publish('solid', 'MQTT says: Hello Sebastian!')
			} else {
				console.log(err)
			}
			
		})
	
	}) 
	
	
	client.on('message', function (topic, message) {
			// message is Buffer
			console.log(message.toString())

			//TODO: add handlers for topics
	})
	
}