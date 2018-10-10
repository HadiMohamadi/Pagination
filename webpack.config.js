const { join } = require('path')

module.exports = {

  devtool: 'cheap-source-map',

  entry: join(__dirname, 'src/index'),

  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },

  resolve: {
    extensions: ['.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['ts-loader']
      }
    ]
  },
  externals: {
		"jquery": "$"
	}
}
