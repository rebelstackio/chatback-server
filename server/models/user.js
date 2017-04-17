/* server/models/user.js */

'use strict';

const firebase = require('firebase');

const aguid = require('aguid');

const reference = global.CONFIG_DATABASE.ref();

const ERROR = require('error');

const auth = require('auth');

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
	roles: auth.ROLES.anonymous,
	restoreToken: '',
	chatSettings: {
		audioNotification: true,
		webNotification: true,
		avatarUrl: ''
	}
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

/**
 * _createUser - Create a new user
 *
 * @param  {string} organizationId User's Organization Id
 * @param  {object} userBody       User's props
 * @param  {function} next         callback
 */
const createAdminByOrgId = function _createAdminByOrgId ( organizationId, userBody, next ) {
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
			body.password = aguid(body.password);
			//ADMIN ROLE
			body.roles = auth.ROLES.admin;
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

const authenticate = function _authenticate ( organizationId, admin, next ) {
	//UUID FOR EMAIL
	const id = aguid(admin.email);
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		id
	);
	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			const _admin = snapshot.val();
			if ( _admin.password == aguid(admin.password)) {
				LOGGER.info('Admin: ' + _admin._id + ' (' + _admin.email + ') authenticated' );
				return next(null, _admin);
			} else {
				return next(
					new ERROR.BadRequestError(
						"Username or password was incorrect"
					)
				)
			}
		} else {
			return next(
				new ERROR.NotFoundError(
				 'User not found'
				)
			);
		}
	}).catch( function( error ) {
		return next(
			new ERROR.DataBaseError(
				error,
				error.message
			)
		);
	});
};


/**
 * _recoverSession - Create a new user
 *
 * @param  {string} organizationId User's Organization Id
 * @param  {object} userBody       User's props
 * @param  {function} next         callback
 */
const recoverSession = function _recoverSession ( organizationId, email, next ) {
	//UUID FOR EMAIL
	const id = aguid(email);
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		id
	);
	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			const token = aguid();
			snapshot.ref.update(
				{
					restoreToken: token,
					updatedAt: firebase.database.ServerValue.TIMESTAMP,
				}
			).then( function(snapshot){
				return next(null,{
					token: token,
					id: id
				});
			}).catch( function(error){
				return next(
					new ERROR.DataBaseError(
						error,
						error.message
					)
				);
			});
		} else {
			return next(
				new ERROR.NotFoundError(
				 'User not found'
				)
			);
		}
	}).catch( function(error){
		return next(
			new ERROR.DataBaseError(
				error,
				error.message
			)
		);
	});
};

const checkToken = function _checkToken( organizationId, userId, token, next) {
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		userId
	);

	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			const user = snapshot.val();
			if (user.restoreToken === token ) {
				snapshot.ref.update(
					{
						restoreToken: '',
						updatedAt: firebase.database.ServerValue.TIMESTAMP,
					}
				).then( function(snapshot){
					return next(
						null
					);
				}).catch( function(error){
					return next(
						new ERROR.DataBaseError(
							error,
							error.message
						)
					);
				});
			} else {
				return next(
					new ERROR.ForbiddenError(
						'Wrong verification code. Check your email account.'
					)
				)
			}
		} else {
			return next(
				new ERROR.NotFoundError(
				 'User not found'
				)
			);
		}
	});
}

const getUserById = function _getUserById( organizationId, userId, next) {
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		userId
	);

	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			const user = snapshot.val();
			return next(null, user);
		} else {
			return next(
				new ERROR.NotFoundError(
				 'User not found'
				)
			);
		}
	});
}

const updateUserByOrgId = function _updateUserByOrgId(organizationId, userId, updates, next) {
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).child(
		userId
	).child(
		'chatSettings'
	);

	userRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			snapshot.ref.update(
				updates
			).then( function(snapshot){
				return next(
					null
				);
			}).catch( function(error){
				return next(
					new ERROR.DataBaseError(
						error,
						error.message
					)
				);
			});
		} else {
			return next(
				new ERROR.NotFoundError(
				 'User not found'
				)
			);
		}
	});
}

const getAllUserByOrgId = function _getAllUserByOrgId(organizationId, next) {
	const userRef = reference.child(
		'users'
	).child(
		organizationId
	).orderByChild(
		"roles"
	).equalTo(
		auth.ROLES.anonymous
	);

	userRef.once("value").then(function( snapshot ) {
		const users = snapshot.val();
		next(null, users);
	}).catch( function(error){
		 next(
			new ERROR.DataBaseError(
				error,
				error.message
			)
		);
	});
}



exports.createUserByOrgId = createUserByOrgId;

exports.recoverSession = recoverSession;

exports.checkToken = checkToken;

exports.getUserById = getUserById;

exports.updateUserByOrgId = updateUserByOrgId;

exports.getAllUserByOrgId = getAllUserByOrgId;

exports.createAdminByOrgId = createAdminByOrgId;

exports.authenticate = authenticate;
