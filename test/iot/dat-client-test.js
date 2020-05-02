const assert = require('chai').assert
const jwt = require('jsonwebtoken')
const DATChecker = require('../../lib/iot/dat-checker')

serialiseJwtTest = function() {

    var options = {
        algorithm: "HS256"
    }

    var DatPayload = {
        "@context": "https://w3id.org/idsa/contexts/3.0.0/context.json",
        "@type":"ids:DatPayload",
        "iss": "DD:CB:FD:0B:93:84:33:01:11:EB:5D:94:94:88:BE:78:7D:57:FC:4A:keyid:CB:8C:C7:B6:85:79:A8:23:A6:CB:15:AB:17:50:2F:E6:65:43:5D:E8",
        "sub": "DD:CB:FD:0B:93:84:33:01:11:EB:5D:94:94:88:BE:78:7D:57:FC:4A:keyid:E1:8C:C7:B6:85:79:A8:23:A6:CB:03:AB:17:50:2F:E6:65:43:5D:F9",
        "exp": 1600157656,
        "iat": 1585149036,
        "nbf": 1585149036,
        "aud": "soliot",
        "scope": "https://w3id.org/idsa/core/Connector",
        "referringConnector": "http://localhost",
        "transportCertsSha256": ["public key of transport cert"],
        "securityProfile": "idsc:BaseConnector",
        "extendedGuarantee": ["idsc:REMOTE_LOGGING"]
    }

    var DAT = jwt.sign(DatPayload, "secret", options);
    console.log(DAT);
    return DAT;
};


parseDatTest = function() {
    var DAT = serialiseJwtTest();

    var DatPayload = jwt.verify(DAT, "secret");
    console.log(DatPayload);
}
parseDatTest();



describe('Validate the Dynamic Attribute Token (DAT)', function () {
    it('Should accept the DAT', function (done) {
        var DAT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJAY29udGV4dCI6Imh0dHBzOi8vdzNpZC5vcmcvaWRzYS9jb250ZXh0cy8zLjAuMC9jb250ZXh0Lmpzb24iLCJAdHlwZSI6ImlkczpEYXRQYXlsb2FkIiwiaXNzIjoiREQ6Q0I6RkQ6MEI6OTM6ODQ6MzM6MDE6MTE6RUI6NUQ6OTQ6OTQ6ODg6QkU6Nzg6N0Q6NTc6RkM6NEE6a2V5aWQ6Q0I6OEM6Qzc6QjY6ODU6Nzk6QTg6MjM6QTY6Q0I6MTU6QUI6MTc6NTA6MkY6RTY6NjU6NDM6NUQ6RTgiLCJzdWIiOiJERDpDQjpGRDowQjo5Mzo4NDozMzowMToxMTpFQjo1RDo5NDo5NDo4ODpCRTo3ODo3RDo1NzpGQzo0QTprZXlpZDpFMTo4QzpDNzpCNjo4NTo3OTpBODoyMzpBNjpDQjowMzpBQjoxNzo1MDoyRjpFNjo2NTo0Mzo1RDpGOSIsImV4cCI6MTYwMDAwMDAwMCwiaWF0IjoxNTg1MTQ5MDM2LCJuYmYiOjE1ODUxNDkwMzYsImF1ZCI6InNvbGlvdCIsInNjb3BlIjoiaHR0cHM6Ly93M2lkLm9yZy9pZHNhL2NvcmUvQ29ubmVjdG9yIiwicmVmZXJyaW5nQ29ubmVjdG9yIjoiaHR0cDovL2xvY2FsaG9zdCIsInRyYW5zcG9ydENlcnRzU2hhMjU2IjpbInB1YmxpYyBrZXkgb2YgdHJhbnNwb3J0IGNlcnQiXSwic2VjdXJpdHlQcm9maWxlIjoiaWRzYzpCYXNlQ29ubmVjdG9yIiwiZXh0ZW5kZWRHdWFyYW50ZWUiOlsiaWRzYzpSRU1PVEVfTE9HR0lORyJdfQ.r59C02EhSHbKipDF1sX3gWDifdNNnf87U9pq7ICImH07VdYsOOuaWtlGNWw1LgOvRgfwTigsrpyhZ7nnIc0PS3hDTTTa-G1rn-grUEzrGEX_xGNbm78nxiyJZ8yGQ2ivxlDxXu_i9QSZ6VnR-9O1OznwB6MGzVKlGmgVeoMFvdEOpvVaXG4p6fbMtvwVv6CiZf2JJw_Chjr_evpAcMPzWoJ3vG8j9c-PznV1WGc1ZbpOhACpOwt_1lUqI9OUginsRJxF6-rLmvdW25WSoxzJP5N_Q1UxF7BCPnzJJWhI-L454NxpYv-Cqhxs020DVyTgtHttzu3-G_qPEWzDhbY2rA"
        var checker = new DATChecker()
        assert(checker.isValid(DAT), true)
        done()
    })

});