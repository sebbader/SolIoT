const assert = require('chai').assert
const program = require('commander')

const debugMqtt = require('debug')('soliot:mqtt')
require('../../bin/lib/mqtt')


describe('Test the MQTT Publish functionality', function () {

        it('Should publish the message at a local MQTT Message Broker', function (done) {

            try {
                var mqtt = new MQTT()
                mqtt.loadMqtt(program, function() {

                    mqtt.publishUpdate("http://127.0.0.1/test-resource","<./test-resource> rdfs:comment \"This resource has been updated.\"", 
                        function(){

                        // mqtt.endClient()
                        })

                })
            } catch(err) {
                debugMqtt("Error in MQTT test: " + err);
                mqtt.endClient();
                throw err
            }
            done()
        })
})