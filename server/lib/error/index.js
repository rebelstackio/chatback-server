/* lib/error/index.js */
'use strict';

const error = module.exports = {};

error.codes = require('./codes');

error.VCOErrorBase = class VCOErrorBase /*{Abstract}*/ {
	/**
	 * @param {string}  message
	 * @param (integer) httpStatus
	 */
	constructor( message, httpStatus ) {
		this.message = message;
		this.httpStatus = httpStatus;
	}

	log(){
		LOGGER.error( this );
	}
}

// 400 Client Error

/** ErrorParams
 * @param {string}  message
 * @param {number}   httpStatus
 */

error.BadRequestError = class BadRequestError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.BAD_REQUEST );
		this.code = vcocode;
	}
};

error.NotFoundError = class NotFoundError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.RESOURCE_NOT_FOUND);
		this.code = vcocode;
	}
}

error.HTTPHeaderError = class HTTPHeaderError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.HEADER_ERROR );
		this.code = vcocode;
	}
}

error.LoginError = class LoginError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.LOGIN_ERROR );
		this.code = vcocode;
	}
};

error.SignUpError = class SignUpError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.SIGNUP_ERROR );
		this.code = vcocode;
	}
};

error.ForbiddenError = class ForbiddenError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.FORBIDDEN );
		this.code = vcocode;
	}
};

error.ConflictError = class ConflictError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.CONFLICT );
		this.code = vcocode;
	}
};

error.JSONValidationError = class JSONValidationError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, origval, errorDetail, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.INVALID_JSON );
		this.errorDetail = errorDetail;
		this.origValue = origval;
		this.code = vcocode;
	}
};

// 500 Server Error

error.RequiredParameterError = class RequiredParameterError extends error.VCOErrorBase {
	/** #ErrorParams */
	constructor( message, httpStatus, vcocode ) {
		super( message, httpStatus || error.codes.REQ_PARAM );
		this.code = vcocode
		//Error.captureStackTrace(this, arguments.callee);
	}
};

error.VCOStackErrorBase = class VCOStackErrorBase extends error.VCOErrorBase {
	/** { Abstract }
	 * @param {Error}
	 * @param {string} message
	 */
	constructor( errobj, message, httpStatus ) {
		super( message, httpStatus );
		this.originalError = errobj;
		Error.captureStackTrace( this );
	}
};


/** StackErrorParams
 * @param {Error}  errobj
 * @param {string} message
 * @param {number}  code
 */

error.ReqBodyParseError = class ReqBodyParseError extends error.VCOStackErrorBase {
	/** #StackErrorParams */
	constructor( errobj, message, httpStatus, vcocode ) {
		super( errobj, message, httpStatus || error.codes.BAD_REQUEST );
		this.code = vcocode;
	}
};

error.ServerError = class ServerError extends error.VCOStackErrorBase {
	/** #StackErrorParams */
	constructor(errobj, message, httpStatus, vcocode ) {
		super( errobj, message, httpStatus || error.codes.SERVER_ERROR );
		this.code = vcocode;
	}
};

error.DataBaseError = class DataBaseError extends error.VCOStackErrorBase {
	constructor( errobj, message, httpStatus, vcocode ) {
		super( errobj, message, httpStatus || error.codes.DB_SERVER_ERROR );
		this.code = vcocode;
	}
};
