#! /bin/bash

rm -R ./node-solid-server/*
cp -R ../.well-known ./node-solid-server/
cp -R ../bin ./node-solid-server/
cp -R ../common ./node-solid-server/
cp -R ../config ./node-solid-server/
cp -R ../data ./node-solid-server/
cp -R ../lib ./node-solid-server/
cp -R ../static ./node-solid-server/

cp -R ../.acl ./node-solid-server/
cp -R ../favicon.ico.acl ./node-solid-server/
cp -R ../robots.txt.acl ./node-solid-server/
cp -R ../index.html ./node-solid-server/
cp -R ../favicon.ico ./node-solid-server/
cp -R ../node-solid-server.iml ./node-solid-server/
cp -R ../index.js ./node-solid-server/
cp -R ../config.json ./node-solid-server/
cp -R ../package.json ./node-solid-server/
cp -R ../config.json-default ./node-solid-server/
cp -R ../.npmignore ./node-solid-server/
cp -R ../robots.txt ./node-solid-server/

docker build -t registry.gitlab.cc-asp.fraunhofer.de:4567/sbader/soliot .
