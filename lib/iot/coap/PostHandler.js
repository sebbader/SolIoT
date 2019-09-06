/*
*   <#PostHandler> 
*       <http://www.w3.org/2000/01/rdf-schema#comment> "The CoAP handler for POST requests"@en ;
*       <http://schema.org/author> https://sebatianrbader.inrupt.net/profile/card#me> ;
*   .
*/

PostHandler = function() {

    this.handle = function(req, res) {
        
        console.log(req.url)
        res.end('CoAP POST for ' + req.url + '\n with payload: \n' + req.payload)
        
    }

}