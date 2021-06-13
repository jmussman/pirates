const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {

    mode: 'development', // Change to 'production' for production build.
	devtool: 'inline-source-map', // It is recommended to take this out for production build.

    entry: './src/index.js',
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
            process: 'process/browser'
        }),
	],
	resolve: {
        alias: {
            process: 'process/browser',
            stream: "stream-browserify",
            zlib: "browserify-zlib"
        },
		extensions: [ '.js', '.mjs' ],
        fallback: {
            "crypto": require.resolve("crypto-browserify")
        },
        modules: [ path.resolve(__dirname, 'src'), 'node_modules']
	},
	output: {
		filename: 'main_bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
        },
        historyApiFallback: true,    // This is a SPA, so ignore unknown paths and launch the SPA.
		port: 9000
	}
};