const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: ['./src/renderer/renderer.tsx'],
  output: {
    path: path.join(__dirname, '..', '..'),
    filename: 'renderer.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  }
}