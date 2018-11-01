// To suppress warnings, this will be fixed with vue 2.6 https://github.com/vuejs/vue/issues/8810
process.noDeprecation = true;

module.exports = {
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
		],
	},
};
