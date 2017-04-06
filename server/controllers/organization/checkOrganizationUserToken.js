'use strict';
/* controllers/user/checkOrganizationUserToken.js
* Controller definition for the user POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');


module.exports = function checkOrganizationUserToken ( req, res, next ) {
	const path = req.path;
	const organizationId = req.params.orgid;
	const userId  = req.params.userid;
	const token = req.body.token;

	User.checkToken(organizationId, userId, token, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			return VCOController.respondSuccessRequest( req, res )
		}
	})

};
