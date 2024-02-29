/**
 * Truncates a given string to a specified length, adding ellipsis if necessary.
 *
 * @param {string} str - The input string to be truncated
 * @param {number} length - The maximum length of the truncated string
 * @return {string} The truncated string
 */
export default (str, length) => {
  if (str.length > length) {
    const lastSpaceIndex = str.substr(0, length).lastIndexOf(" ");
    str =
      lastSpaceIndex !== -1
        ? str.substr(0, lastSpaceIndex) + "..."
        : str.substr(0, length) + "...";
  }
  return str;
};
