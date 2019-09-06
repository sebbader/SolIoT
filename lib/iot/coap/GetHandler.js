/*
*   <#GetHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for GET requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

const getHandler = require('../../handlers/get')

GetHandler = function() {

    this.handle = function(req, res) {
        
        console.log(req.url)
        getHandler(req, res)
        res.end('CoAP GET for ' + req.url)
        
    }

}