'use strict';

const REQUESTEXCEPTIONS = require('./request_exceptions');

const REQUESTERRORS = require('./request_errors');

const VCOController = require('controller/VCOController');

const validateRequest = function( reqExceptions ){

	return function( req, res, next ) {

		for (let i = 0; i < reqExceptions.length; i++) {
			if (typeof reqExceptions[i] == 'string') {
				reqExceptions[i] = REQUESTEXCEPTIONS[reqExceptions[i]];
			}
			const condition = eval(reqExceptions[i].condition);
			if (reqExceptions[i].type && condition) {
				const err = new REQUESTERRORS[reqExceptions[i].type](
					reqExceptions[i].message,
					reqExceptions[i].code
				);
				return VCOController.respondError( req, res, err );
			} else if ( condition ) {
				return VCOController.respondError(
					req, res,
					new Error( reqExceptions[i].message )
				);
			}
		}
		return next();
	};
}


module.exports = {
	validateRequest: validateRequest,
	REQUESTEXCEPTIONS: REQUESTEXCEPTIONS
};
