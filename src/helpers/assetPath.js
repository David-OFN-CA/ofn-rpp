import path from "@helpers/path";

/**
 * Returns the URL based on the target.
 * @param {string} target - The target for generating the URL.
 * @returns {string} - The generated URL.
 */
export default (target) => {
  if(import.meta.env.DEV) {
    return path(target);
  } else {
    return new URL("." + target, "https://cdn.jsdelivr.net/npm/@startinblox/component-ofn-rpp/dist/").href
  }
}
