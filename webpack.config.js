var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    entry: {
      bundle: './app.js',
      vendors: ['react', 'react-dom']
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist', 'assets'),
      publicPath: '/'
    },
    context: path.resolve(__dirname, 'src'),
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /(node_modules)/
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader']
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('style.css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors'
      })
    ]
  },
  {
    entry: './server.js',
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs'
    },
    context: path.resolve(__dirname, 'src'),
    target: 'node',
    externals: nodeExternals(),
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /(node_modules)/
        }
      ]
    }
  }
]