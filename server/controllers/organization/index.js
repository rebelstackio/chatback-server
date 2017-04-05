'use strict';

/* server/controllers/organization/index.js */


const _createOrganization = require('./createOrganization');

const _createOrganizationUser = require('./createOrganizationUser');

module.exports = {

	"createOrganization": _createOrganization,

	"createOrganizationUser": _createOrganizationUser

}
