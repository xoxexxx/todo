const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    //входная точка
    main: ["@babel/polyfill", "./index.jsx"],
  },
  output: {
    // куда складывать результат работы
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".png", ".jpg"], // Расширения в импорте
  },
  optimization: {
    //Оптимизация билиотек в сборке
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    compress: true,
    port: 3001,
    open: true,
  },
  // поддержка html
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack",
      template: "./index.html",
      minify: {
        collapseWhitespace: true,
      },
    }),
    // сборка стилей
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
    }),
  ],
  module: {
    // модули-лоадеры. файлы, картинки, стили
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"], 
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      //Babel компилятор
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [],
          },
        },
      },
      {
        test: /\.m?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [],
          },
        },
      },
    ],
  },
};
