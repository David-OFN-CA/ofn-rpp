/**
 * Sanitizes the input by removing HTML tags if stripTags is true, otherwise returns the input as is.
 *
 * @param {string} input - The input string to be sanitized
 * @param {boolean} [stripTags=true] - A boolean indicating whether to strip HTML tags (default is true)
 * @return {string} The sanitized input string
 */
export default (input, stripTags=true) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = input;
  if(stripTags) {
    return tmp.textContent || tmp.innerText || "";
  } else {
    return tmp.innerHTML;
  }
};
