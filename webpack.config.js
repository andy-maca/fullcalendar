const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/main.js',
    fullcalender: './src/showFullcalender.js'
  },
  optimization: {
    splitChunks: {
      chunks: "initial",
      filename: "common.js"
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'output management',
      template: './src/index.html',
    })
  ],
  output: {
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'  
        ]
      }
    ]
  }
};