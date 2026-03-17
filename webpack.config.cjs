/**
 * @jac/ui — Webpack library build configuration
 *
 * Produces:
 *   dist/index.js   (ESM — tree-shakeable barrel)
 *   dist/index.cjs  (CJS — Node / legacy require())
 *
 * CSS is handled separately via PostCSS CLI (see build:css script).
 * Type declarations are generated via tsc (see build:types script).
 */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const pkg = require('./package.json');

// Externalize peer deps + runtime deps so they are NOT bundled.
// Consumers install them via their own package manager.
// Use a regex to also catch sub-path imports (e.g. react-dom/client).
const externalPkgs = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
];
const externals = [
  ...externalPkgs.map(name => new RegExp(`^${name}(/.*)?$`)),
];

const isRelease = process.env.NODE_ENV === 'production';

/** Settings shared by ESM and CJS builds */
const shared = {
  mode: 'production',
  devtool: isRelease ? false : 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: { declaration: false, declarationMap: false },
          },
        },
      },
    ],
  },

  optimization: {
    minimize: isRelease,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { drop_console: true, passes: 2 },
          mangle: true,
          output: { comments: false },
        },
      }),
    ],
    usedExports: true,
  },
};

// ── ESM build ───────────────────────────────────────────
const esmConfig = {
  ...shared,
  name: 'esm',
  entry: { index: './src/index.ts' },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: { type: 'module' },
    module: true,
    clean: true,
  },

  experiments: { outputModule: true },
  externalsType: 'module',
  externals,
};

// ── CJS build ───────────────────────────────────────────
const cjsConfig = {
  ...shared,
  name: 'cjs',
  entry: { index: './src/index.ts' },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: { type: 'commonjs2' },
    clean: false,
  },

  externalsType: 'commonjs',
  externals,
};

module.exports = [esmConfig, cjsConfig];
