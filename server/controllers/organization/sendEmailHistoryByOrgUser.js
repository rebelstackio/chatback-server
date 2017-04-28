'use strict';
/* controllers/user/getEmailHistoryByOrgUser.js
* Controller definition for the user POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const Message = require('../../models').getModel('Message');

const User = require('../../models').getModel('User');

const sendEmailHistoryByOrgUser = require('email').sendEmailHistoryByOrgUser;

module.exports = function _sendEmailHistoryByOrgUser ( req, res, next ) {
	const path = req.path;
	const userId = req.params.userid;
	const organizationId = req.params.orgid;

	User.getUserById(organizationId, userId, function( error, user ) {

		Message.getMessageHistoryByUser(userId, function( error, data ) {
			if ( error ) {
				return next( error );
			} else {
				// const resObj = VCOController.wrapSuccessDataObj( data, path );
				// return VCOController.respondSuccessRequest( req, res, resObj )
				sendEmailHistoryByOrgUser(user, data , function(error){
					if ( error ) {
						return next( error );
					} else {
						return VCOController.respondSuccessRequest( req, res )
					}
				})
				return VCOController.respondSuccessRequest( req, res )
			}
		});

	});
};
