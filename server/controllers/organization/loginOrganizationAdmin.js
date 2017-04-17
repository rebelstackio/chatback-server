'use strict';
/*
* controllers/organization/loginOrganizationAdmin.js
* Controller definition for the user organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function loginOrganizationAdmin ( req, res, next ) {
	const organizationId = req.params.orgid;
	const admin = req.body;
	const path = req.path;

	User.authenticate(organizationId, admin, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const auth = require('auth');
			const token = auth.encodeJWT({
				username: req.body.email,
				_id: req.body.id,
				expiresInMinutes: 1440,
				roles: req.body.roles
			});
			res.set({
				'Authorization': 'Bearer ' + token
			});
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	})

};
