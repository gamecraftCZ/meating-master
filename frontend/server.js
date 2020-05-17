var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

const PORT = 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true
}).listen(PORT, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at localhost:${PORT}`);
});
