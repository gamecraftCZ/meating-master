const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const PUBLIC_PATH = '/';

module.exports = {
  mode: 'none',
  entry: './src/index.tsx',
  output: {
    path: path.dirname(__dirname, 'dist'),
    filename: 'static/bundle.js',
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.sass', '.svg', '.png'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@stores': path.resolve(__dirname, 'src/stores/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@helpers': path.resolve(__dirname, 'src/helpers/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@services': path.resolve(__dirname, 'src/services/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 9192,
            },
          },
        ],
      },
      {
        test: /\.ts(x?)$/i,
        exclude: '/node_modules',
        use: ['ts-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
};
