const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.resolve(__dirname, "./src/index.tsx"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
			},
			{
				test: /\.s?css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.svg$/,
				loader: "file-loader",
				options: {
					name: "static/[name].[ext]",
				},
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".js", ".tsx", ".jsx" ],
	},
	plugins: [
		new HtmlPlugin({
			template: path.resolve(__dirname, "index.html"),
			title: "Friends",
			base: "./"
		}),
	],
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist")
	},
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 9090,
		host: "0.0.0.0"
	}
};