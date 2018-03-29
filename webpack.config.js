var path = require('path');

module.exports = {
    entry: '/home/george/Documents/lab/src/main/frontend/js/root.js',
   devtool: 'sourcemaps',
    output: {
		path: path.resolve(__dirname, './target/classes/static'),
        filename: 'built/bundle.js'
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
