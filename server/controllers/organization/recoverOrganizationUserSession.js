'use strict';
/* controllers/user/recoverUserOrganizationSession.js
* Controller definition for the user POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const User = require('../../models').getModel('User');

const recoverSessionEmailNotification = require('email').recoverSessionEmailNotification;

module.exports = function recoverOrganizationUserSession ( req, res, next ) {
	const path = req.path;
	const organizationId = req.params.orgid;
	const email = req.body.email;

	User.recoverSession(organizationId, email, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			recoverSessionEmailNotification(email, data.token , function(error){
				if ( error ) {
					return next( error );
				} else {
					const response = {
						id: data.id
					}
					const resObj = VCOController.wrapSuccessDataObj( response, path );
					return VCOController.respondSuccessRequest( req, res, resObj )
				}
			})
		}
	})

};
