'use strict';

/**
 * registerRouters - Index file for importing the api router definitions
 */
module.exports = function registerRouters( app ) {

	app.use( '/user', require('./user.router') ),

	app.use( '/organization', require('./organization.router') )

};
