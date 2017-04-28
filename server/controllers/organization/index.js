'use strict';

/* server/controllers/organization/index.js */


const _createOrganization = require('./createOrganization');

const _createOrganizationUser = require('./createOrganizationUser');

const _recoverOrganizationUserSession = require('./recoverOrganizationUserSession');

const _checkOrganizationUserToken = require('./checkOrganizationUserToken');

const _getOrganizationUser = require('./getOrganizationUser');

const _updateOrganizationUser = require('./updateOrganizationUser');

const _getAllOrganizationUser = require('./getAllOrganizationUser');

const _createOrganizationAdmin = require('./createOrganizationAdmin');

const _loginOrganizationAdmin = require('./loginOrganizationAdmin');

const _sendEmailHistoryByOrgUser = require('./sendEmailHistoryByOrgUser');

module.exports = {

	"createOrganization": _createOrganization,

	"createOrganizationUser": _createOrganizationUser,

	"recoverOrganizationUserSession": _recoverOrganizationUserSession,

	"checkOrganizationUserToken": _checkOrganizationUserToken,

	"getOrganizationUser": _getOrganizationUser,

	"updateOrganizationUser": _updateOrganizationUser,

	"getAllOrganizationUser": _getAllOrganizationUser,

	"createOrganizationAdmin": _createOrganizationAdmin,

	"loginOrganizationAdmin": _loginOrganizationAdmin,

	"sendEmailHistoryByOrgUser": _sendEmailHistoryByOrgUser
}
