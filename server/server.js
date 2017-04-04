'use strict';

const path = require('path');

const addPath = require('app-module-path').addPath;

if ( process.env.NODE_ENV === 'development' ) {
  const dotenv = require('dotenv-with-overload');
  dotenv.overload();
}
addPath( __dirname );
addPath( path.resolve(__dirname, './lib') );

require('./app');
