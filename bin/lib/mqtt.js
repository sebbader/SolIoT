/**
 * 
 */

var mqtt = require('mqtt')
const debugMqtt = require('debug')('soliot:mqtt')
require('../../lib/iot/mqtt/DeleteHandler')
require('../../lib/iot/mqtt/CreateHandler')
require('../../lib/iot/mqtt/UpdateHandler')
require('../../lib/iot/mqtt/DeleteHandler')

const IotUtils = require('../../lib/iot/IotUtils')

var client;

MQTT = function() {

	
	this.loadMqtt = function(program, callback) {
		var iotUtils = new IotUtils()
		var argv = iotUtils.getArgv(program)

		client  = mqtt.connect(argv.mqttBroker, {rejectUnauthorized: false})
	//	var client  = mqtt.connect('mqtt://test.mosquitto.org')

		//if (!client.connected) throw new Error("Could not connect to MQTT Broker at " + argv.mqttBroker)
		
		var updateHandler = new UpdateHandler(program)
		var createHandler = new CreateHandler(program)
		var deleteHandler = new DeleteHandler(program)
		
		client.on('connect', function () {

			debugMqtt("Connected to MQTT Broker at " + argv.mqttBroker)
			
			if(callback) callback()
		}) 

		client.on('error', function (err) {

			debugMqtt("MQTT Error: " + err)
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
						client.subscribe(argv.mqttMsgTopics + topicParts[1], function (err) {
							if (!err) {
								console.log('Successfully subscribed to topic "' + argv.mqttMsgTopics + '/' + topicParts[1] + '"')
							} else {
								console.log(err)
							}
							
						})
						client.subscribe(argv.mqttMsgTopics + '/' + topicParts[1] + '/delete', function (err) {
							if (!err) {
								console.log('Successfully subscribed to topic "' + argv.mqttMsgTopics + '/' + topicParts[1] + '/delete"')
							} else {
								console.log(err)
							}
							
						})
					}
					
					if (topicParts[topicParts.length - 1] == 'delete'){
						console.log('MQTT DELETE in ' + topic)
						deleteHandler.handle(topic, message)
						client.unsubscribe(argv.mqttMsgTopics + '/' + topicParts[1], function (err) {
							if (!err) {
								console.log('Successfully unsubscribed from topic "' + argv.mqttMsgTopics + '/' + topicParts[1] + '"')
							} else {
								console.log(err)
							}
							
						})
						client.unsubscribe(argv.mqttMsgTopics + '/' + topicParts[1] + '/delete', function (err) {
							if (!err) {
								console.log('Successfully unsubscribed from topic "' + argv.mqttMsgTopics + '/' + topicParts[1] + '/delete"')
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


	this.publishUpdate = function(resourceUri, content, callback) {

		debugMqtt("Publishing 'update'...")
		/*
		var options= {
			qos: 0, 							// QoS level, Number, default 0
			retain: false, 						// retain flag, Boolean, default false
			dup: false, 						// mark as duplicate flag, Boolean, default false
			properties: { 						// MQTT 5.0 properties object
				payloadFormatIndicator: false, 	// Payload is UTF-8 Encoded Character Data or not boolean,
				messageExpiryInterval: 1, 		// the lifetime of the Application Message in seconds number,
				//topicAlias: "", 				// value that is used to identify the Topic instead of using the Topic Name number,
				//responseTopic: "", 			// String which is used as the Topic Name for a response message string,
				//correlationData: "", 			// used by the sender of the Request Message to identify which request the Response Message is for when it is received binary,
				//userProperties: "",			// The User Property is allowed to appear multiple times to represent multiple name, value pairs object,
				//subscriptionIdentifier: representing the identifier of the subscription number,
				//contentType: ""				//String describing the content of the Application Message string
			}//,
			//cbStorePut = function (){} 		//fired when message is put into outgoingStore if QoS is 1 or 2
		}
		*/
		client.publish("soliot/update/" + encodeURIComponent(resourceUri), content, /*options,*/ function(err){
			
			debugMqtt("Sent 'soliot/updated/'" + encodeURIComponent(resourceUri) + " to the MQTT Broker.")
			if(err) {
				debugMqtt("MQTT Broker responded with error: " + err)
				throw err
			} else {
				callback()
			}
		})

	}


	this.publishCreated = function(resourceUri, content, callback) {

		debugMqtt("Publishing 'created'...")
		/*
		var options= {
			qos: 0, 							// QoS level, Number, default 0
			retain: false, 						// retain flag, Boolean, default false
			dup: false, 						// mark as duplicate flag, Boolean, default false
			properties: { 						// MQTT 5.0 properties object
				payloadFormatIndicator: false, 	// Payload is UTF-8 Encoded Character Data or not boolean,
				messageExpiryInterval: 1, 		// the lifetime of the Application Message in seconds number,
				//topicAlias: "", 				// value that is used to identify the Topic instead of using the Topic Name number,
				//responseTopic: "", 			// String which is used as the Topic Name for a response message string,
				//correlationData: "", 			// used by the sender of the Request Message to identify which request the Response Message is for when it is received binary,
				//userProperties: "",			// The User Property is allowed to appear multiple times to represent multiple name, value pairs object,
				//subscriptionIdentifier: representing the identifier of the subscription number,
				//contentType: ""				//String describing the content of the Application Message string
			}//,
			//cbStorePut = function (){} 		//fired when message is put into outgoingStore if QoS is 1 or 2
		}
		*/
		client.publish("soliot/created/" + encodeURIComponent(resourceUri), content, /*options,*/ function(err){
			
			debugMqtt("Sent 'soliot/created/'" + encodeURIComponent(resourceUri) + " to the MQTT Broker.")
			if(err) {
				debugMqtt("MQTT Broker responded with error: " + err)
				throw err
			} else {
				callback()
			}
		})

	}


	this.publishDelete = function(resourceUri, callback) {

		debugMqtt("Publishing 'deletion'...")
		/*
		var options= {
			qos: 0, 							// QoS level, Number, default 0
			retain: false, 						// retain flag, Boolean, default false
			dup: false, 						// mark as duplicate flag, Boolean, default false
			properties: { 						// MQTT 5.0 properties object
				payloadFormatIndicator: false, 	// Payload is UTF-8 Encoded Character Data or not boolean,
				messageExpiryInterval: 1, 		// the lifetime of the Application Message in seconds number,
				//topicAlias: "", 				// value that is used to identify the Topic instead of using the Topic Name number,
				//responseTopic: "", 			// String which is used as the Topic Name for a response message string,
				//correlationData: "", 			// used by the sender of the Request Message to identify which request the Response Message is for when it is received binary,
				//userProperties: "",			// The User Property is allowed to appear multiple times to represent multiple name, value pairs object,
				//subscriptionIdentifier: representing the identifier of the subscription number,
				//contentType: ""				//String describing the content of the Application Message string
			}//,
			//cbStorePut = function (){} 		//fired when message is put into outgoingStore if QoS is 1 or 2
		}
		*/
		client.publish("soliot/deleted/" + encodeURIComponent(resourceUri), "", /*options,*/ function(err){
			
			debugMqtt("Sent 'soliot/deleted/'" + encodeURIComponent(resourceUri) + " to the MQTT Broker.")
			if(err) {
				debugMqtt("MQTT Broker responded with error: " + err)
				throw err
			} else {
				callback()
			}
		})

	}


	this.endClient = function() {
		debugMqtt("Closing MQTT Client...")
		client.end(true)
		debugMqtt("Closed MQTT Client.")
	}
}