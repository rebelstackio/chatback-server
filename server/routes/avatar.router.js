'use strict';
/*
 * routes/avatar.route.js
 *
 * Route configuration for avatar resources
 *
 * */
const controller = require('controllers/avatar');

const express = require('express')

const router = express.Router();

router.get('/', controller.getAvatars);

module.exports = router;
