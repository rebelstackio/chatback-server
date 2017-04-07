'use strict';
/*
* controllers/organization/getAllOrganizationUser.js
* Controller definition for the users organization GET endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function getAllOrganizationUser ( req, res, next ) {
	const organizationId = req.params.orgid;
	const path = req.path;
	User.getAllUserByOrgId(organizationId, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	})

};
