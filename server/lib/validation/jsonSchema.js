'use strict';

const ERROR = require('error');

const Ajv = require('ajv');
const ajv = new Ajv( { allErrors: true, validateSchema: "log" } );

const parseErrorArray = function( errorDetails ){
	if(
		!(Array.isArray( errorDetails ) &&
		errorDetails.length > 0)
	){
		throw new TypeError("parseErrorArray parameter should be an array");
	}

	const errorMessageArray = [];
	errorDetails.forEach( function( errorObj ){
		const property = errorObj.dataPath;
		let message = property
			? "Invalid value for " + property.split('.')[ property.split('.').length - 1 ]
			: errorObj.message;
		errorMessageArray.push({
			dataPath: errorObj.dataPath,
			params: errorObj.params,
			message: errorObj.message
		});
	})

	return errorMessageArray;

};

const validateSchema = function( schema ) {

	return function( req, res, next ){

		const valid = ajv.validate( schema, req.body );

		if ( !valid ) {
			return next(
				new ERROR.JSONValidationError(
					"Error validating parameters",
					req.body,
					parseErrorArray( ajv.errors )
				)
			);
		} else {
			return next();
		}
	};
};

const validateVideoSchema = function() {

	return function( req, res, next ){

		const Video = require('../../models').getModel('Video');

		const vId = req.body.video;

		Video.getById( vId, function( err, video ){
			if( err ) {
				return next( err );
			} else {
				const valid = ajv.validate( video.formConfig, req.body.customFields );
				if ( !valid ) {
					return next(
						new ERROR.JSONValidationError(
							"Error validating parameters",
							req.body,
							parseErrorArray( ajv.errors )
						)
					);
				} else {
					return next();
				}
			}
		});

	};
};


module.exports = {
	validateSchema: validateSchema,
	parseErrorArray: parseErrorArray,
	validateVideoSchema: validateVideoSchema
}
