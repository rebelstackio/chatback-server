'use strict';
/*
* 'croles': {
'rroles': user's roles: integer,
'droles': user's denied roles: integer
}
*/
const VCOController = require('controller/VCOController');

const auth = require('./auth');

const ERROR = require('error');

const _isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) == '[object Object]';
}

const _isValidRolesObject = function( croles ) {
	return _isObject( croles )
		&& (
			croles.hasOwnProperty( 'rroles' )
			|| croles.hasOwnProperty( 'droles' )
		);
}

module.exports = function auth( croles ){
	return function( req, res, next ) {

		const tokenPayload = auth.authorize( req, res );

		if ( !!tokenPayload ) {
			if ( croles && _isValidRolesObject( croles ) ) {
				const requiredRole = controllerConfig.croles.rroles;
				const deniedRoles = controllerConfig.croles.droles;
				if (
					requiredRole
					&& !auth.hasRequiredRoles( tokenPayload.roles, requiredRole )
				) {
					const error = new ERROR.ForbiddenError(
						"User does not have the correct roles for this request."
					);
					return VCOController.respondError( req, res, error );
				}
				if (
					deniedRoles
					&& !auth.hasNoDeniedRoles( tokenPayload.roles, deniedRoles )
				) {
					const error = new ERROR.ForbiddenError(
						"User has roles that are denied for this request."
					);
					return VCOController.respondForbidden( req, res, error );
				}
			}

			req.tokenPayload = tokenPayload;
			return next();
		}
	}
}
