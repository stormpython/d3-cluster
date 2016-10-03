const webpack = require('webpack');
const port = 8080;

module.exports = {
  entry: {
    'cluster': './index.js',
    'cluster.min': './index.js'
  },
  output: {
    path:  __dirname + '/build',
    filename: '[name].js',
  },
  devtool: 'source-map',
  debug: true,
  devServer: {
    inline: true,
    hot: true,
    historyApiFallback: false,
    compress: true,
    port: port
  },
  watch: true,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|__tests__)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    })
  ]
};
