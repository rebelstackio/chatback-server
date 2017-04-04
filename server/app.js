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

try {
	const firebaseApp = firebase.initializeApp({
		apiKey: process.env.FB_APIKEY,
		authDomain: process.env.FB_AUTHDOMAIN,
		databaseURL: process.env.FB_DATABASEURL,
		storageBucket: process.env.FB_STORAGEBUCKET,
		messagingSenderId: process.env.FB_MESSAGINGSENDERID
	});

} catch (e) {
	LOGGER.error( e );
	process.exit(1);
}

LOGGER.info("Firebase App created!");

// load all models
// TODO LOAD THE MODELS
// require('./models');

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

//TODO Just for now!!
const cors = require('cors');
app.use(cors({'exposedHeaders': ['Authorization']}));


const port = process.env.PORT || '10000';
app.set('port', port);

const server = app.listen( port, ( err, data ) => {
	LOGGER.info( 'Listening on ' + server.address().port );
});
