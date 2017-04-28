/* server/models/user.js */

'use strict';

const firebase = require('firebase');

const aguid = require('aguid');

const reference = global.MESSAGE_DATABASE.ref();

const ERROR = require('error');

const auth = require('auth');


const getMessageHistoryByUser = function _createUser ( userId, next ) {

	const messageRef = reference.child(
		'messages'
	).child(
		userId
	);

	messageRef.once("value").then(function( snapshot ) {
		if ( snapshot.hasChildren() ) {
			next(
				null,
				snapshot.val()
			)
		} else {
			next(
				new ERROR.NotFoundError(
					'There are not message for this account'
				)
			);
		}

	}).catch(function(error){
		next(
			new ERROR.DataBaseError(
				error,
				error.message
			)
		);
	});
};

exports.getMessageHistoryByUser = getMessageHistoryByUser;
