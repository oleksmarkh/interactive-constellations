const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {NODE_ENV, PUBLIC_PATH} = process.env;

const IS_PROD = NODE_ENV === 'production';

const SRC_DIR = path.resolve('./src/');
const DIST_DIR = path.resolve('./dist/');
const NODE_MODULES_DIR = path.resolve('./node_modules/');

console.log('IS_PROD:', IS_PROD);
console.log('PUBLIC_PATH:', PUBLIC_PATH);

const loaders = {};
const plugins = {};

loaders.tslint = {
  test: /\.ts$/,
  enforce: 'pre',
  loader: 'tslint-loader',
  exclude: NODE_MODULES_DIR,
  options: {
    configFile: path.resolve('./tslint.json'),
  },
};

loaders.ts = {
  test: /\.ts$/,
  use: [
    {
      loader: 'awesome-typescript-loader',
      options: {
        useCache: true,
        useBabel: true,
        babelOptions: {
          babelrc: true,
          compact: true,
        },
      },
    },
  ],
  exclude: NODE_MODULES_DIR,
};

plugins.html = new HtmlWebpackPlugin({
  template: './app/index.html',
  title: 'interactive-constellations',
});

plugins.commonsChunk = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: ({context}) => {
    return context && context.includes('node_modules');
  },
  filename: `vendor${IS_PROD ? '-[hash].min' : ''}.js`,
});

plugins.uglifyJs = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
});

plugins.namedModules = new webpack.NamedModulesPlugin();

plugins.hotModuleReplacement = new webpack.HotModuleReplacementPlugin();

const config = {
  context: SRC_DIR,

  entry: './app/index.ts',

  output: {
    path: DIST_DIR,
    filename: `bundle${IS_PROD ? '-[hash].min' : ''}.js`,
    publicPath: PUBLIC_PATH,
  },

  resolve: {
    modules: [
      path.resolve('./'),
      'node_modules',
    ],
    extensions: [
      '.js',
      '.ts',
    ],
  },

  module: {
    rules: [
      loaders.tslint,
      loaders.ts,
    ],
  },

  plugins: [
    plugins.html,
    plugins.commonsChunk,
  ].concat(IS_PROD
    ? [
      plugins.uglifyJs,
    ]
    : [
      plugins.namedModules,
      plugins.hotModuleReplacement,
    ]
  ),

  devServer: {
    contentBase: DIST_DIR,
    hot: true,
  },

  devtool: 'inline-source-map',
};

module.exports = config;
