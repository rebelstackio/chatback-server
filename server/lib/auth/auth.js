/* lib/auth/index.js
 *	Authorization (not authentication) module for VCO server
 * */
'use strict';

const JWT = require('jwt-simple');

const ERROR = require('error');

const VCOController = require('controller/VCOController');

const JWT_SECRET = process.env.JWT_SECRET || 'donttellanyone';

const ROLES = {
	anonymous: 0,
	admin: Math.pow(2, 0),
	registered: Math.pow(2, 1),
	beta: Math.pow(2, 2),
	plan1: Math.pow(2, 3),
	plan2: Math.pow(2, 4),
	plan3: Math.pow(2, 5),
	suspended: Math.pow(2, 29),
	super: Math.pow(2, 30) //1073741824
};

const _required = function(uroles, rroles) {

	const filtered = (uroles & rroles); /* jshint ignore:line */
	return !(filtered ^ rroles) /* jshint ignore:line */

};

// NOTE: returns false when a role in uroles is matched in rroles
const _denied = function(uroles, rroles) {

	return !(uroles & rroles) /* jshint ignore:line */

};

const _decodeJWT = function _decodeJWT(jwt) {
	return JWT.decode(jwt, JWT_SECRET);
};

const _encodeJWT = function _encodeJWT(payload) {
	return JWT.encode(payload, JWT_SECRET);
};

/*
 * if there is a valid token, it returns the user's info stored in the token payload:
 * - username
 * - _id
 * - roles
 * otherwise returns false and sends back an error to the client
 */
const _authorize = function _authorize( req, res, next ) {


	let error;
	let tokenPayload = {};

	if (req.headers && req.headers.authorization) {
		let parts = req.headers.authorization.split(' ');
		if (parts.length == 2) {
			let scheme = parts[0];
			let credentials = parts[1];
			if (/^Bearer$/i.test(scheme)) {
				let token = credentials;
				if (token) {
					try {

						let dtoken = _decodeJWT(token);
						//Login JWT
						// {
						// 	"_id": string,
						// 	"username": email,
						// 	roles: integer
						// }
						if(dtoken.hasOwnProperty("_id")) {
							let uroles = dtoken.roles;
							switch (true) {
								case (typeof uroles != 'number'):
								case (uroles < 0):
									const err = new ERROR.LoginError(
										'JWT payload is corrupt',
										ERROR.codes.JWT_PAYLOAD_CORRUPT
									);
									VCOController.respondError( req, res, err );
									return false;
							}
						} else {
							//Password Reset JWT
							// {
							// 	"username": email,
							// }
							switch (true) {
								case (!dtoken.hasOwnProperty("username")):
								case (dtoken.hasOwnProperty("roles")):
									const err = new ERROR.LoginError(
										'JWT payload is corrupt',
										ERROR.codes.JWT_PAYLOAD_CORRUPT
									);
									VCOController.respondError( req, res, err );
									return false;
							}
						}

						return dtoken;

					} catch (e) {
						let err;
						switch (e.message) {
							//TODO Remove hidden character from first test case
							case "Unexpected token ":
							case "Unexpected end of input":
								err = new ERROR.LoginError(
									'JWT payload is corrupt',
									ERROR.codes.JWT_PAYLOAD_CORRUPT
								);
								VCOController.respondError( req, res, err );
							return false;
							case "Algorithm not supported":
								err = new ERROR.LoginError(
									'JWT algorithm not supported',
									ERROR.codes.JWT_UNSUPPORTED_ALGORITHM
								);
								VCOController.respondError( req, res, err );
								return false;
							case "Token not yet active":
								err = new ERROR.LoginError(
									'Token not yet active',
									ERROR.codes.JWT_TOKEN_NOT_ACTIVE
								);
								VCOController.respondError( req, res, err );
								return false;
							case "Token expired":
								err = new ERROR.LoginError(
									'Token expired',
									ERROR.codes.JWT_TOKEN_EXPIRED
								);
								VCOController.respondError( req, res, err );
								return false;
							case "Signature verification failed":
								err = new ERROR.LoginError(
									'Signature verification failed',
									ERROR.codes.JWT_SIG_VERIFY_FAILED
								);
								VCOController.respondError( req, res, err );
								return false;
							default:
								err = new ERROR.LoginError(
									e,
									'Token Decode:: ' + e.message,
									ERROR.codes.JWT_PAYLOAD_CORRUPT
								);
								VCOController.respondError(req, res, err);
								return false;
						}
					}
				} else {
					let err = new ERROR.LoginError(
						'No authorization token was found',
						ERROR.codes.JWT_CREDS_REQUIRED
					);
					VCOController.respondError( req, res, err );
					return false;
				}
			} else {
				let err = new ERROR.LoginError(
					'Format is Authorization: Bearer [token]',
					ERROR.codes.JWT_CREDS_BAD_SCHEME
				);
				VCOController.respondError( req, res, err );
				return false;
			}
		} else {
			let err = new ERROR.LoginError(
				'Format is Authorization: Bearer [token]',
				ERROR.codes.JWT_CREDS_BAD_FORMAT
			);
			VCOController.respondError( req, res, err );
			return false;
		}
	} else {
		let err = new ERROR.LoginError(
			'No authorization token was found',
			ERROR.codes.JWT_CREDS_REQUIRED
		);
		VCOController.respondError( req, res, err );
		return false;
	}
}

const _parseRoles = function _parseRoles( rolesList ){
	let parsedRoles = 0;

	rolesList.forEach( ( roleName ) => {
		if( ROLES.hasOwnProperty( roleName ) ){
			parsedRoles = parsedRoles | ROLES[roleName];
		}
	} );

	return parsedRoles;

}

module.exports = {

	ROLES: ROLES,

	authorize: _authorize,

	encodeJWT: _encodeJWT,

	decodeJWT: _decodeJWT,

	hasRequiredRoles: _required,

	hasNoDeniedRoles: _denied,

	parseRoles: _parseRoles

}
