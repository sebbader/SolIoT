'use strict'

const rdf = require('rdflib')
const debug = require('../debug')('solid-iot:coap')
const { URL } = require('url')
const { promisify } = require('util')
const fs = require('fs')
const Url = require('url')
const httpFetch = require('node-fetch')

const jwt = require('jsonwebtoken')
var path = require('path');

// 
class DATChecker {

    // 
    async isValid (DAT) {
        const dir = "./trustedDAPS"

        fs.readdir(dir, function (err, files) {
            if (err) {
              debug("Could not list the directory.", err);
            }
          
            files.forEach(function (file, index) {
                file = dir + '/' + file 
                var cert = fs.readFileSync(file); // get public key
                jwt.verify(DAT, cert, { algorithms: ['RS256'] }, function (err, payload) {
                    // if token alg != RS256,  err == invalid signature
                    if (err) {
                        debug(err)
                    } else {
                        return true
                    }
                });
            })
        })
        return false
    }
}

module.exports = DATChecker
