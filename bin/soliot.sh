#!/bin/bash

# log all events with a soliot topic
export DEBUG="soliot:*"

# start the server
node ./solid start