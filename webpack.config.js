/* eslint-disable */

const webpack = require('webpack')

module.exports = {

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  entry: './client/app/index.js',

  output: {
    path: './client/build/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: { presets: ['es2015', 'stage-1', 'react'] },
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css' +
            '?modules' +
            '&importLoaders=1' +
            '&localIdentName=[name]__[local]__[hash:base64:5]',
          // 'postcss',
        ],
        exclude: [/node_modules/],
      },
    ],
  },

  // postcss: [
  //   require('autoprefixer'),
  // ],

  devtool: '#eval',

}
