/* server/models/avatar.js */

'use strict';

const firebase = require('firebase');

const reference = global.CONFIG_DATABASE.ref();

const ERROR = require('error');


const getAll = function _getAll( next ) {
	const avatarRef = reference.child(
		'avatars'
	);

	avatarRef.once("value").then(function( snapshot ) {
		const avatars = snapshot.val();
		return next(null, avatars);
	}).catch(function(error){
		new ERROR.DataBaseError(
			error,
			error.message
		)
	});
}

exports.getAll = getAll;
