// pirates-api: webpack.config.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//

const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin')
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development', // Change to 'production' for production build.
	devtool: 'inline-source-map', // It is recommended to take this out for production build.
    
	entry: './src/server.js',
    experiments: {
        topLevelAwait: true
    },
    externals: [ nodeExternals() ],
	target: 'web',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env',
						{
							plugins: [
                                '@babel/plugin-proposal-class-properties',
                                [ '@babel/plugin-transform-runtime', { regenerator: true } ]
                            ]
						}
					]
				}
			}
		]
	},
	plugins: [
        new NodemonPlugin()
	],
	resolve: {
		extensions: [ '.js', '.mjs' ],
        modules: [ path.resolve(__dirname, 'src'), 'node_modules']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'pirates-api-server.js'
	}
};
