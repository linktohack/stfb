const path = require('path');

module.exports = {
  entry: './src/stfb.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    'babylonjs': 'BABYLON',
    'ammojs-typed': 'Ammo'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    'babylonjs': 'BABYLON',
    'cannon': 'CANNON',
    'ammojs': 'Ammo'
  }
};