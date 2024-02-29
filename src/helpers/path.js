/**
 * Generate the path from the target URL.
 *
 * @param {string} target - The target URL to generate the path from. Defaults to current directory.
 * @return {string} The generated path.
 */
export default (target=".") => {
  let path = new URL(target, import.meta.url).href;
  return path;
}