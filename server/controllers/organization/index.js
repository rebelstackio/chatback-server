'use strict';

/* server/controllers/organization/index.js */


const _createOrganization = require('./createOrganization');

const _createOrganizationUser = require('./createOrganizationUser');

const _recoverOrganizationUserSession = require('./recoverOrganizationUserSession');

const _checkOrganizationUserToken = require('./checkOrganizationUserToken');

const _getOrganizationUser = require('./getOrganizationUser');

module.exports = {

	"createOrganization": _createOrganization,

	"createOrganizationUser": _createOrganizationUser,

	"recoverOrganizationUserSession": _recoverOrganizationUserSession,

	"checkOrganizationUserToken": _checkOrganizationUserToken,

	"getOrganizationUser": _getOrganizationUser
}
