const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: {
    main: './src/main/main.ts',
  },
  output: {
    path: path.join(__dirname, '..', '..'),
    filename: 'main.js'
  },
  mode: 'development',
  plugins: [
    new Dotenv({
    path: './.env'
    }),
    new webpack.DefinePlugin({
      'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
    })
  ],
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
    extensions: ['.ts', '.js']
  },
  target: 'electron-main'
}