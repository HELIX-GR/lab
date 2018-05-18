var path = require('path');

module.exports = {
  entry: [
    './src/main/frontend/js/main.js',
    './src/main/frontend/scss/main.scss',
  ],
  mode: 'development',
  devtool: 'sourcemaps',
  output: {
    path: path.resolve(__dirname, './target/classes/static'),
    filename: 'js/bundle.js'
  },
  node: {
    net: 'empty',
    dns: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  }
};
