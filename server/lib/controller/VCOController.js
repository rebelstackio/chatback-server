'use strict';

const isFlashClient = function _isFlashClient( req ){
	if( req.body ){
		return ( req.body.flashClient ) ? req.body.flashClient : false;
	}else {
		return false;
	}
}

module.exports = class VCOController {

	static buildResponseObj(
		request,
		type,
		dataObj,
		isErrorResponse,
		stripNull
	) {

		var _removeNulls = function( obj ) {
			if (obj instanceof Array) {
				for (var j in obj) {
					return _removeNulls(obj[j]);
				}
			}
			for (var k in obj) {
				if (obj[k] === null) {
					delete obj[k];
				} else if (typeof obj[k] == "object") {
					_removeNulls(obj[k]);
				}
			}
		};
		const resObj = {};
		if ( stripNull ) {
			_removeNulls(dataObj);
		}
		if ( type ) {
			resObj.type = type;
		}
		if ( dataObj ) {
			if( isErrorResponse ){
				resObj.error = dataObj;
			}else {
				resObj.data = dataObj;
				if(isFlashClient(request)){
					resObj.httpStatus = 200;
				}
			}
		}
		if (Object.keys( resObj ).length > 0){
			return resObj;
		} else {
			return void 0;
		}
	}

	static wrapSuccessDataObj (
		dataObj,
		type,
		stripNulls
	) {
		if ( typeof type == 'boolean' ) {
			stripNulls = type;
			type = undefined;
		}

		const dataObjWrapper = {};
		dataObjWrapper.type = type;
		dataObjWrapper.data = dataObj;
		dataObjWrapper.stripNulls = stripNulls;
		return dataObjWrapper;
	}

	static respondError (
		request,
		response,
		errObj
	) {

		let statusCode = 500;
		let responseData = {};
		let responseType = "error";

		if ( errObj ) {
			if ( errObj.log ) errObj.log();
			responseData = errObj;
			responseType = errObj.constructor.name;
			if ( isFlashClient(request)){
				statusCode = 200;
			}else{
				statusCode = errObj.httpStatus
				? errObj.httpStatus
				: statusCode;
			}
		} else{
			responseData.message = "Unexpected Error";
			responseData.httpStatus = 500;
		}

		const isErrorResponse = true;
		const stripNulls = false;
		const resJSON = this.buildResponseObj(
			request,
			responseType,
			responseData,
			isErrorResponse,
			stripNulls
		);
		response.set( 'Content-Type', 'application/json' );
		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	}

	static respondSuccessRequest ( request, response, wrappedData ) {
		let statusCode = 200;
		let responseType = "success";

		if ( wrappedData ) {
			const responseData = wrappedData.data ? wrappedData.data : {};
			responseType = wrappedData.type ? wrappedData.type : responseType;
			statusCode = wrappedData.httpStatus ? wrappedData.httpStatus : statusCode;
			const stripNulls = wrappedData.stripNulls;
			const isErrorResponse = false;
			const resJSON = VCOController.buildResponseObj(
				request,
				responseType,
				responseData,
				isErrorResponse,
				stripNulls
			);

			response.set( 'Content-Type', 'application/json' );
			return response.status( statusCode ).send( JSON.stringify( resJSON ) );
		} else {
			return response.status( 204 ).send();
		}
	}
}


	// static respondInvalidRequest (
	// 	request,
	// 	response,
	// 	errObj,
	// 	includeErrObj
	// ) {
	// 	let statusCode = 400;
	// 	let type = "Request_Invalid_Error";
	// 	const responseData = {};
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		type = errObj.constructor.name;
	// 		responseData.message = errObj.message
	// 			? errObj.message
	// 			: "Invalid Request Error";
	//
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	//
	// 			if(includeErrObj){
	// 				errObj.stackTrace = errObj.stack;
	// 				responseData.data = errObj;
	// 			}else{
	// 				if(errObj.stack){
	// 					responseData.stack = errObj.stack;
	// 				}
	// 			}
	// 	}
	//
	// 	const resJSON = VCOController.buildResponseObj( type, responseData, false );
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }
	//
	// static respondInvalidJSON ( request, response, errObj ) {
	//
	// 	let statusCode = 500;
	// 	let type = "Request_Invalid_Error";
	// 	const responseData = {};
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		type = errObj.constructor.name;
	// 		responseData.message = errObj.message
	// 			? errObj.message
	// 			: "Invalid Request Error";
	//
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	//
	// 		if (errObj.errorDetail) {
	// 			responseData.errorDetail = errObj.errorDetail;
	// 		}
	// 		if (errObj.origValue) {
	// 			responseData.origValue = errObj.origValue;
	// 		}
	// 	}
	//
	// 	const resJSON = VCOController.buildResponseObj( type, responseData, false );
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }
	//
	// static respondNotAuthorized ( request, response, errObj ) {
	//
	// 	let statusCode = 401;
	// 	let type = "Request_Authorisation_Error";
	//
	// 	const responseData = {};
	// 	responseData.message = "Authorisation error";
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		type = errObj.constructor.name;
	// 		responseData.message = errObj.message
	// 			?errObj.message
	// 			:responseData.message;
	//
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	// 	}
	//
	// 	const resJSON = VCOController.buildResponseObj( type, responseData, false );
	// 	response.set( 'WWW-Authenticate', 'application/json' );
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }
	//
	// static respondForbidden ( request, response, errObj ) {
	//
	// 	let statusCode = 403;
	// 	let type = "Request_Authorisation_Error";
	//
	// 	const responseData = {};
	// 	responseData.message = "Forbidden";
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		type = errObj.constructor.name;
	// 		responseData.message = errObj.message
	// 			?errObj.message
	// 			:responseData.message;
	//
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	// 	}
	// 	let resJSON = VCOController.buildResponseObj( type, responseData, false );
	// 	//response.set('WWW-Authenticate', 'application/x-www-form-urlencoded');
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }
	//
	// static respondNotFound ( request, response, errObj ) {
	//
	// 	let statusCode = 404;
	// 	let type = "error";
	//
	// 	const responseData = {};
	// 	responseData.message = "Resource not found";
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		type = errObj.constructor.name;
	// 		responseData.message = errObj.message
	// 			?errObj.message
	// 			:responseData.message;
	//
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	// 	}
	//
	// 	const resJSON = VCOController.buildResponseObj(
	// 		type,
	// 		responseData,
	// 		false
	// 	);
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }
	//
	// static respondError (
	// 	request,
	// 	response,
	// 	errObj
	// ) {
	//
	// 	let statusCode = 500;
	// 	let responseData = {};
	//
	// 	if ( errObj ) {
	// 		if ( errObj.log ) errObj.log();
	// 		responseData = errObj;
	// 		type = errObj.constructor.name;
	// 		statusCode = errObj.httpStatus
	// 			?errObj.httpStatus
	// 			:statusCode;
	// 	} else{
	// 		responseData.message = "Unexpected Error";
	// 		responseData.httpStatus = 500;
	// 	}
	//
	// 	const resJSON = this.buildResponseObj( type, responseData, false );
	// 	response.set( 'Content-Type', 'application/json' );
	// 	return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// }

	//
	// static respondPOSTCreated (
	// 	request,
	// 	response,
	// 	location,
	// 	wrappedData
	// ) {
	//
	// 	if(typeof location !== 'string'){
	// 		throw new TypeError('Location header value is required');
	// 	};
	//
	// 	let statusCode = 201;
	//
	// 	if ( wrappedData ) {
	// 		const responseData = wrappedData.data ? wrappedData.data : {};
	// 		const responseType = wrappedData.type ? wrappedData.type : "created";
	// 		statusCode = wrappedData.httpStatus ? wrappedData.httpStatus : statusCode;
	// 		const stripNulls = wrappedData.stripNulls;
	// 		const resJSON = VCOController.buildResponseObj(
	// 			responseType,
	// 			responseData,
	// 			stripNulls
	// 		);
	//
	// 		response.set( 'Content-Type', 'application/json' );
	// 		response.set( 'Location', location );
	// 		return response.status( statusCode ).send( JSON.stringify( resJSON ) );
	// 	} else {
	// 		return response.status( 204 ).send();
	// 	}
	// }
