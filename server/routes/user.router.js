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

router.get('/test', controller.test);

module.exports = router;
