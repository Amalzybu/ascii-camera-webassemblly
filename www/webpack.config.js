const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');



module.exports = {
  entry: "./bootstrap.js",
  devServer: {
    host: '0.0.0.0',//your ip address
    port: 8080,
    disableHostCheck: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin(['index.html'])
  ],
};


