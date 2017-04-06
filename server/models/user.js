/* server/models/user.js */

'use strict';

const firebase = require('firebase');

const fbencode = require('firebase-encode').encode;

const aguid = require('aguid');

const reference = global.CONFIG_DATABASE.ref();

const ERROR = require('error');

/********USERS MODEL*********/
// name
// email
// createdAt
// updatedAt
// restoreToken
// chatSettings
// avatarUrl

const DEFAULT_USER_MODEL = {
	name: '',
	email: '',
	createdAt: firebase.database.ServerValue.TIMESTAMP,
	updatedAt: '',
	restoreToken: '',
	chatSettings: {
		audioNotification: true,
		webNotification: true
	},
	avatarUrl: ''
}

/**
 * _getDefaultUserObject - Creates a default user object with default props
 *
 * @param  {object} user User object
 */
const getDefaultUserObject = function _getDefaultUserObject( user ) {
	return Object.assign(DEFAULT_USER_MODEL, user);
}


/**
 * _createUser - Create a new user
 *
 * @param  {string} organizationId User's Organization Id
 * @param  {object} userBody       User's props
 * @param  {function} next         callback
 */
const createUserByOrgId = function _createUser ( organizationId, userBody, next ) {
	//UUID FOR EMAIL
	const id = aguid(userBody.email);
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		id
	);
	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			return next(
				new ERROR.ConflictError(
				 'Email already used. You should recover your previous conversation in the chat settings'
				)
			);
		} else {
			const body = getDefaultUserObject(userBody);
			userRef.set(body).then( function() {
				body.id = id;
				return next(null, body);
			}).catch( function( error ){
				return next(
					new ERROR.DataBaseError(
						error,
						error.message
					)
				);
			});
		}
	});

};


exports.createUserByOrgId = createUserByOrgId;
