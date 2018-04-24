var path = require('path');

module.exports = {
    entry: './src/main/frontend/js/main.js',
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
      }
    ]
  }
};
