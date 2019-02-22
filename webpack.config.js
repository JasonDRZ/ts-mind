const path = require("path");
module.exports = (env = {}) => {
	const { minimize = false } = env;
	return {
		mode: "production",
		entry: {
			"ts-mind": "./src/index.ts"
		},
		output: {
			path: path.resolve(__dirname, "lib-umd"),
			filename: `[name]${minimize ? ".min" : ""}.js`,
			libraryTarget: "umd",
			library: "TSMind",
			umdNamedDefine: true
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js"]
		},
		devtool: "source-map",
		optimization: {
			minimize
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: "awesome-typescript-loader",
							query: {
								declaration: false
							}
						}
					]
				}
			]
		}
	};
};
