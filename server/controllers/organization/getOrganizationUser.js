'use strict';
/*
* controllers/organization/getOrganizationUser.js
* Controller definition for the user organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function getOrganizationUser ( req, res, next ) {
	const organizationId = req.params.orgid;
	const userId = req.params.userid;
	const path = req.path;

	User.getUserById(organizationId, userId, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	})

};
