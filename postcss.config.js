import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssPresetEnv from "postcss-preset-env";

export default {
  syntax: "postcss-scss",
  plugins: [autoprefixer, cssnano, postcssPresetEnv],
};
