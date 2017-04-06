'use strict';
/*
* controllers/organization/getAvatars.js
* Controller definition for the user organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const Avatar = require('../../models').getModel('Avatar');

module.exports = function getAvatars ( req, res, next ) {
	const path = req.path;

	Avatar.getAll(function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			const resObj = VCOController.wrapSuccessDataObj( data, path );
			return VCOController.respondSuccessRequest( req, res, resObj );
		}
	});

};
