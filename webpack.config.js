var path = require('path');

module.exports = {
    entry: '/home/george/Documents/lab/src/main/frontend/js/main.js',
   devtool: 'sourcemaps',
    output: {
		path: path.resolve(__dirname, './target/classes/static'),
        filename: 'built/bundle.js'
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
