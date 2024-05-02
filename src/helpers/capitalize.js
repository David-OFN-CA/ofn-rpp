
/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
export default (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
