'use strict';
/*
* controllers/organization/createOrganizationUser.js
* Controller definition for the user organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function createOrganizationUser ( req, res, next ) {
	const organizationId = req.params.orgid;
	const user = req.body;
	const path = req.path;

	User.createUserByOrgId(organizationId, user, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	})

};
