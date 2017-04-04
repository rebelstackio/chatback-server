/* server/models/organization.js */
'use strict';

const firebase = require('firebase');

const reference = global.CONFIG_DATABASE.ref();

const ERROR = require('error');

const _createOrganization = function _createOrganization ( organization, next ) {
	const orgReference = reference.child('organizations');
	const newOrganization = orgReference.push();
	organization.createdAt = firebase.database.ServerValue.TIMESTAMP;
	organization.updatedAt = '';
	newOrganization.set(organization).then( function() {
		return next(null);
	}).catch( function( error ){
		return next(
			new ERROR.DataBaseError(
				error,
				error.message
			)
		);
	});
};


exports.createOrganization = _createOrganization;
