'use strict';
/*
 * routes/common.route.js
 *
 * Route configuration for users resources
 *
 * */
const controller = require('controllers/organization');

const express = require('express')

const router = express.Router();

const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json( { strict: false } );

const VR = require('validation/request');

const RX = VR.REQUESTEXCEPTIONS;

const VALIDATESCHEMA = require( 'validation/jsonSchema' ).validateSchema;


router.post('/', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
	],
	controller.createOrganization
);

router.post('/:orgid/user', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
		VALIDATESCHEMA( require('../validation/schemas/user.schema') )
	],
	controller.createOrganizationUser
);

router.patch('/:orgid/user', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] )
	],
	controller.recoverOrganizationUserSession
);

router.patch('/:orgid/user/:userid', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] )
	],
	controller.checkOrganizationUserToken
);

module.exports = router;
