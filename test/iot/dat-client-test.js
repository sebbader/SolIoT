const jwt = require('jsonwebtoken')


serialiseJwtTest = function() {

    var options = {
        algorithm: "HS256"
    }

    var DatPayload = {
        "@context": "https://w3id.org/idsa/contexts/3.0.0/context.json",
        "@type":"ids:DatPayload",
        "iss": "DD:CB:FD:0B:93:84:33:01:11:EB:5D:94:94:88:BE:78:7D:57:FC:4A:keyid:CB:8C:C7:B6:85:79:A8:23:A6:CB:15:AB:17:50:2F:E6:65:43:5D:E8",
        "sub": "DD:CB:FD:0B:93:84:33:01:11:EB:5D:94:94:88:BE:78:7D:57:FC:4A:keyid:CB:8C:C7:B6:85:79:A8:23:A6:CB:15:AB:17:50:2F:E6:65:43:5D:E8",
        "exp": "1h",
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