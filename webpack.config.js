const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|wav|glb)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};