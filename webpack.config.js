const path = require('path');

module.exports = {
  mode: 'production',

  optimization: {
    minimize: true,
  },

  entry: {
    index: './index.js',
  },

  output: {
    path: __dirname,
    filename: '[name].min.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ],
  },
};

