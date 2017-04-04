const REQError = module.exports = {};

const _extend = function( extension, base ) {
  function Closure() {}
  Closure.prototype = base.prototype;
  extension.prototype = new Closure();
  extension.prototype.constructor = extension;
};

const _codes = {

  "BAD_HEADER": 400.3,
  "NOT_ACCEPT_JSON": 400.31,
  "XTOKEN_INVALID": 400.32,
  "NOT_FORM_URLENCODED_OR_APPLICATION_JSON": 400.33,
  "NOT_APPLICATION_JSON": 400.34,
  "NOT_EMPTY_REQUEST_BODY": 400.35,

  "REQUIRED_PARAMETER_MISSING": 400.4,

  "INVALID_TOKEN": 400.5,

  "LOGIN_ERROR": 401.1,
  "NO_USER_MATCH": 401.11,
  "PASSWORD_WRONG": 401.12,

  "INT_SERVER_ERROR": 500.1,
  "DB_SERVER_ERROR": 500.3,
  "EXT_SERVER_ERROR": 500.9

};

REQError.codes = _codes;

REQError.errorjson = function( message ) {
  return {
    "error": message
  };
};

REQError.ExtendErrorBase = function ExtendErrorBase(message) {
  this.message = message;
	this.httpStatus = 400;
  Error.captureStackTrace(this, arguments.callee);
};
_extend( REQError.ExtendErrorBase, Error );

REQError.HTTPHeaderError = function HTTPHeaderError(message, code) {
  this.code = code || REQError.codes.BAD_HEADER;
  REQError.ExtendErrorBase.call(this, message);
};
_extend(REQError.HTTPHeaderError, REQError.ExtendErrorBase);

REQError.LoginError = function LoginError(message, code) {
  this.code = code || REQError.codes.LOGIN_ERROR;
  REQError.ExtendErrorBase.call(this, message);
};
_extend(REQError.LoginError, REQError.ExtendErrorBase);

REQError.RequiredParameterError = function RequiredParameterError(message, code) {
  this.code = code || REQError.codes.REQUIRED_PARAMETER_MISSING;
  this.message = message;
  Error.captureStackTrace(this, arguments.callee);
};

REQError.DataBaseError = function DataBaseError(dbErrorObj, message, code) {
  this.errorObj = dbErrorObj;
  this.message = message;
  this.httpStatusCode = 500;
  this.code = REQError.codes.DB_SERVER_ERROR || code;
  Error.captureStackTrace(this, arguments.callee);
};
_extend(REQError.DataBaseError, REQError.ExtendErrorBase);

REQError.BadRequestError = function BadRequestError(message, code) {
  this.message = message;
  this.httpStatusCode = 400;
  this.code = code || null;
};
// NOTE: no stack trace desired here...
// _extend ( REQError.BadRequestError, REQError.ExtendErrorBase );

REQError.ServerError = function ServerError(errorObj, message, code) {
  this.errorObj = errorObj;
  this.message = message;
  this.httpStatusCode = 500;
  this.code = code || REQError.codes.INT_SERVER_ERROR;
  Error.captureStackTrace(this, arguments.callee);
};
_extend(REQError.ServerError, REQError.ExtendErrorBase);

REQError.AWSError = function ServerError(errorObj, message, code) {
  this.errorObj = errorObj;
  this.message = message;
  this.httpStatusCode = 500;
  this.code = code || REQError.codes.AWS_ERROR;
  Error.captureStackTrace(this, arguments.callee);
};
_extend(REQError.ServerError, REQError.ExtendErrorBase);

REQError.ValueConstraintError = function ValueConstraintError(message, value,
  constraint) {
  this.message = message;
  this.value = value;
  this.constraint = constraint;
  this.httpStatusCode = 500;
  this.code = REQError.codes.INT_SERVER_ERROR;
  Error.captureStackTrace(this, arguments.callee);
};
_extend( REQError.ValueConstraintError, REQError.ExtendErrorBase );
