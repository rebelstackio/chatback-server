'use strict';
/*
 * routes/common.route.js
 *
 * Route configuration for users resources
 *
 * */
const controller = require('controllers/user');

const express = require('express')

const router = express.Router();

const bodyParser = require('body-parser');

const bodyParserJSON = bodyParser.json( { strict: false } );

const VR = require('validation/request');

const RX = VR.REQUESTEXCEPTIONS;

router.get('/test', controller.test);

// router.post('/:orgid/', [
// 		bodyParserJSON,
// 		VR.validateRequest( [ RX.NOT_ACCEPT_JSON, RX.NOT_APPLICATION_JSON ] ),
// 	],
// 	controller.createUser
// );

module.exports = router;
