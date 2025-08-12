const path = require('path');

module.exports = {
  entry: './static/js/blocknote-init.js',
  output: {
    filename: 'blocknote-bundle.js',
    path: path.resolve(__dirname, 'static/js'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: 'production',
};