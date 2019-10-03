/**
 * 
 */

var mqtt = require('mqtt')
require('../../lib/iot/mqtt/CreateHandler')
require('../../lib/iot/mqtt/UpdateHandler')
require('../../lib/iot/mqtt/DeleteHandler')

module.exports = function (program) {
	
	var client  = mqtt.connect('mqtt://localhost:1883')
//	var client  = mqtt.connect('mqtt://test.mosquitto.org')
	
	var updateHandler = new UpdateHandler(program)
	var createHandler = new CreateHandler(program)
	var deleteHandler = new DeleteHandler(program)
	
	client.on('connect', function () {
		
		client.subscribe('solid/+/create', function (err) {
			if (!err) {
				console.log('Successfully subscribed to topic "solid/+/create"')
			} else {
				console.log(err)
			}
			
		})
	
	}) 
	
	
	client.on('message', function (topic, message) {
			// message is Buffer
			//console.log('\nMQTT:\nOn topic: ' + topic + '\nRecieved message: ' + message.toString())

			//TODO: add handlers for topics
			let topicParts = topic.split('/')
			
			// topic = solid/<resID>/[create|delete]
			if (topicParts.length == 3){
				
				if (topicParts[topicParts.length - 1] == 'create'){
					console.log('MQTT CREATE in ' + topic)
					createHandler.handle(topic, message)
					client.subscribe('solid/' + topicParts[1], function (err) {
						if (!err) {
							console.log('Successfully subscribed to topic "solid/' + topicParts[1] + '"')
						} else {
							console.log(err)
						}
						
					})
					client.subscribe('solid/' + topicParts[1] + '/delete', function (err) {
						if (!err) {
							console.log('Successfully subscribed to topic "solid/' + topicParts[1] + '/delete"')
						} else {
							console.log(err)
						}
						
					})
				}
				
				if (topicParts[topicParts.length - 1] == 'delete'){
					console.log('MQTT DELETE in ' + topic)
					deleteHandler.handle(topic, message)
					client.unsubscribe('solid/' + topicParts[1], function (err) {
						if (!err) {
							console.log('Successfully unsubscribed from topic "solid/' + topicParts[1] + '"')
						} else {
							console.log(err)
						}
						
					})
					client.unsubscribe('solid/' + topicParts[1] + '/delete', function (err) {
						if (!err) {
							console.log('Successfully unsubscribed from topic "solid/' + topicParts[1] + '/delete"')
						} else {
							console.log(err)
						}
						
					})
				}
				
			} else {
				// topic = solid/<resID>
				if (topicParts.length == 2){
					console.log('MQTT UPDATE for ' + topic)
					updateHandler.handle(topic, message)
				}
			}
			
	})
	
}