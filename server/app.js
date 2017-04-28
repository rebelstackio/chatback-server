'use strict';

const path = require('path');

const routes = require('./routes');

const VCOController = require('controller/VCOController');

const ERROR = require('error');

const Logger = require('logger');

const firebase = require('firebase');

global.LOGGER = new Logger(process.env.NODE_ENV);

const express = require('express');
const app = express();

const allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Accept,Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header('Access-Control-Expose-Headers', 'Accept,Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
};

app.use(allowCrossDomain)

/*
Don't accept requests that are not https.
We need this as heroku forwards all requests from its proxy as http.
*/
const forceSsl = function(req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};

if (process.env.NODE_ENV === 'production') {
	app.use(forceSsl);
}

let firebaseApp;
let firebaseMessageApp;

try {
	firebaseApp = firebase.initializeApp({
		apiKey: process.env.FB_CONFIG_APIKEY,
		authDomain: process.env.FB_CONFIG_AUTHDOMAIN,
		databaseURL: process.env.FB_CONFIG_DATABASEURL,
		storageBucket: process.env.FB_CONFIG_STORAGEBUCKET,
		messagingSenderId: process.env.FB_CONFIG_MESSAGINGSENDERID
	});

	firebaseMessageApp = firebase.initializeApp({
		apiKey: process.env.FB_MESSAGE_APIKEY,
		authDomain: process.env.FB_MESSAGE_AUTHDOMAIN,
		databaseURL: process.env.FB_MESSAGE_DATABASEURL,
		storageBucket: process.env.FB_MESSAGE_PROJECTID,
		messagingSenderId: process.env.FB_MESSAGE_MESSAGINGSENDERID
	}, 'MESSAGE');

} catch (e) {
	LOGGER.error( e );
	process.exit(1);
}

global.CONFIG_DATABASE = firebaseApp.database();

global.MESSAGE_DATABASE = firebaseMessageApp.database();

LOGGER.info("Firebase App created!");

// load all models
require('./models');

//Register routes
require('./routes')( app );

app.use( function( req, res, next ) {

	VCOController.respondError(
		req, res,
		new ERROR.NotFoundError(
			"There is no endpoint at " +
			req.path +
			". Would you like us to add it?"
		)
	);
});

// this is a Express SyntaxError which is stepping in our way when,
// for example, submitted JSON syntax is incorrect

app.use ( function _parseSyntaxError ( error, req, res, next ) {
	switch ( true ) {
		case ( error instanceof SyntaxError ):
		const errObj =	new ERROR.ReqBodyParseError(
			error,
			'bodyParser:: ' + error.message
		);
		return VCOController.respondError( req, res, errObj );

		default:
		next( error );
	}
});

app.use ( function _respondError ( error, req, res, next ) {
	const VCOErrorBase = ERROR.VCOErrorBase;
	const VCOStackErrorBase = ERROR.VCOStackErrorBase;

	if( error instanceof VCOErrorBase || error instanceof VCOStackErrorBase ){
		return VCOController.respondError( req, res, error );
	}else {
		next( error );
	}
});

const port = process.env.PORT || '10000';
app.set('port', port);

const server = app.listen( port, ( err, data ) => {
	LOGGER.info( 'Listening on ' + server.address().port );
});
