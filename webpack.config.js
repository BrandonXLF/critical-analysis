module.exports = {
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: 'raw-loader',
			}
		]
	}
};
