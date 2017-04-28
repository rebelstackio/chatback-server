'use strict';
/*
 * routes/organization.route.js
 *
 * Route configuration for users resources
 *
 * */
const controller = require('controllers/organization');

const express = require('express')

const router = express.Router();

const bodyParser = require('body-parser');

const bodyParserJSON = bodyParser.json( { strict: false } );

const authMiddleware = require('auth');

const VR = require('validation/request');

const RX = VR.REQUESTEXCEPTIONS;

const VALIDATESCHEMA = require( 'validation/jsonSchema' ).validateSchema;


router.post('/', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
	],
	controller.createOrganization
);

router.post('/:orgid/admin', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
		VALIDATESCHEMA( require('../validation/schemas/user.schema') )
	],
	controller.createOrganizationAdmin
);

router.post('/:orgid/login', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
	],
	controller.loginOrganizationAdmin
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

router.post('/:orgid/user/:userid', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] )
	],
	controller.checkOrganizationUserToken
);

router.patch('/:orgid/user/:userid', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] )
	],
	controller.updateOrganizationUser
);


router.get('/:orgid/user', controller.getAllOrganizationUser);

router.get('/:orgid/user/:userid', controller.getOrganizationUser);

router.post('/:orgid/user/:userid/history', [
		bodyParserJSON,
		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] )
	],
	controller.sendEmailHistoryByOrgUser
);

module.exports = router;
