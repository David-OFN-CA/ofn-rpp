const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    autoprefixer,
    cssnano,
    postcssPresetEnv
  ],
};