const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	target: 'web',
	mode: 'development', // Change to 'production' for production build.
	devtool: 'inline-source-map', // It is recommended to take this out for production build.
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
							plugins: [ '@babel/plugin-proposal-class-properties' ]
						}
					]
				}
			},
			{
				test: /\.css$/i,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					name: 'assets/images/[name].[ext]'
				}
			}
		]
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'index.html', context: path.resolve(__dirname, 'src') },
				{ from: 'favicon.ico', context: path.resolve(__dirname, 'src') }
			]
		}),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
	],
	resolve: {
		extensions: [ '.js', '.mjs' ],
        fallback: {
            "crypto": require.resolve("crypto-browserify")
        },
        alias: {
            process: 'process/browser',
            stream: "stream-browserify",
            zlib: "browserify-zlib"
        }
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main_bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
        historyApiFallback: true    // This is a SPA, so ignore anything in the URL that isn't found on the server.
	}
};
