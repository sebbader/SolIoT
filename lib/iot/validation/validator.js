const fs = require('fs');

const SHACLValidator = require('shacl');
const debugValidation = require('debug')('soliot-iot:validation')

const shapes = fs.readFileSync('lib/iot/validation/td-validation.ttl', 'utf-8');

Validator = function() {

    this.validateData = function(data) {
		
		var validator = new SHACLValidator();
        var isValid;
		validator.validate(data, 'text/turtle', shapes, 'text/turtle', (err, report) => {
            if (err) {
				debugValidation('SHACL VALIDATION: ERROR -- ' + err)
			} else {
				if (!report.conforms()) {
					report.results().forEach(res => {
						let s = res.severity();
						let n = res.focusNode();
						let p = res.path();
						p = p.replace(/.*#/g, '');
						let m = res.message();

						debugValidation('SHACL VALIDATION: FAILURE -- ' + s + ' on <' + n + '> (' + p + '): ' + m)
					});
					isValid = false
				} else {
					debugValidation('SHACL VALIDATION: SUCCESS')
					isValid = true
				}
			}
		});
		return isValid
	}
	
}