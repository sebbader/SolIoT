#!/bin/bash

# log all events with a soliot topic
export DEBUG="soliot:*"

# start the server
node /node-solid-server/bin/solid start --no-reject-unauthorized