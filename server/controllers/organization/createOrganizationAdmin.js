'use strict';
/*
* controllers/organization/createOrganizationAdmin.js
* Controller definition for the user organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function createOrganizationAdmin ( req, res, next ) {
	const organizationId = req.params.orgid;
	const admin = req.body;
	const path = req.path;

	User.createAdminByOrgId(organizationId, admin, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const auth = require('auth');
			const token = auth.encodeJWT({
				username: req.body.email,
				_id: req.body.id,
				expiresInMinutes: 1440
			});
			res.set({
				'Authorization': 'Bearer ' + token
			});
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	})

};
