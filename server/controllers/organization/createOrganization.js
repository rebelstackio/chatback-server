'use strict';
/* controllers/organization/createOrganization.js
* Controller definition for the organization POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

const Organization = require('../../models').getModel('Organization');

module.exports = function createOrganization ( req, res, next ) {
	const path = req.path;
	Organization.createOrganization(req.body, function( error, data ) {
		if ( error ) {
			return next( error );
		} else {
			return VCOController.respondSuccessRequest( req, res );
		}
	})

};
