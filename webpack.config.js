var path = require('path');
var eq = require('lodash/eq');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '/react/index.js'),
    "./assets/sass/index.scss"
  ],
  output: {
      path: path.join(__dirname, '/dist'),
      filename: "[name].js",
      publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|dist)/,
        loaders: [ 'babel' ]
      },
      {
          test: /\.scss$/,
          loaders: ['style', 'css?sourceMap', 'sass?sourceMap' ]
      },
      {
         test: /\.(woff|woff2|ttf|svg|eot|png|jpg)/, 
         loader: 'url-loader' 
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'react/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
    //new webpack.optimize.UglifyJsPlugin({ minimize: true, mangle: false, sourcemap: false })

  ]
}