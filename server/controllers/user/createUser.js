'use strict';
/* controllers/user/createUser.js
* Controller definition for the user POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

module.exports = function createUser ( req, res, next ) {
	const path = req.path;
  	const organizationId = req.body.organizationId;
  	const user = req.body.user;
  
	User.createUser(organizationId, user, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			return VCOController.respondSuccessRequest( req, res );
		}
	})

};
