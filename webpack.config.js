const path = require('path');

const dist = './dist';

module.exports = {
  mode: 'production',

  optimization: {
    minimize: false,
  },

  entry: {
    index: './index.js',
  },

  output: {
    path: path.resolve(__dirname, dist),
    filename: '[name].js'
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

