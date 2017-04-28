module.exports.getModel = function( modelName ) {
	return this.models[ modelName ];
};

module.exports.models = {

	Organization : require('./organization'),

	User: require('./user'),

	Avatar: require('./avatar'),

	Message: require('./message')

};
