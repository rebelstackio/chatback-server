'use strict';
/* controllers/user/updateOrganizationUser.js
* Controller definition for the user PATCH endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');


module.exports = function updateOrganizationUser ( req, res, next ) {
	const path = req.path;
	const organizationId = req.params.orgid;
	const userId  = req.params.userid;
	const updates = req.body;

	User.updateUserByOrgId(organizationId, userId, updates, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			return VCOController.respondSuccessRequest( req, res )
		}
	})

};
