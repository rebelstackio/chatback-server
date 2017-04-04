'use strict';
/* controllers/carts/postCart.js
* Controller definition for the cart POST endpoint
*
*/
const VCOController = require( 'controller/VCOController' );

module.exports = function test ( req, res, next ) {
  const path = req.path;
  const resObj = VCOController.wrapSuccessDataObj( {'test':'test'}, path );
	return VCOController.respondSuccessRequest( req, res, resObj );
};
