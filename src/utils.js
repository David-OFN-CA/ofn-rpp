export const componentName = "ofn-rpp";

export const CLIENT_CONTEXT = {
  // "ofn:First_Nations_country": "ofn:first_nations_country",
};

/**
 * Generate the path from the target URL.
 *
 * @param {string} target - The target URL to generate the path from. Defaults to current directory.
 * @return {string} The generated path.
 */
export function path(target=".") {
  let path = new URL(target, import.meta.url).href;
  return path;
}

/**
 * Function to retrieve the core version URL.
 *
 * @return {string} The URL for the core version.
 */
export function coreVersion() {
  let coreUrl = "https://cdn.skypack.dev/@startinblox/core";
  if(import.meta.env.DEV) {
    coreUrl = "http://localhost:3000/dist/index.js";
  }
  return coreUrl;
}

/**
 * Generates a unique random string using the Math.random() method.
 *
 * @return {string} A unique random string.
 */
export function uniq() {
  return Math.random().toString(16).slice(2);
}

/**
 * Sanitizes the input by removing HTML tags if stripTags is true, otherwise returns the input as is.
 *
 * @param {string} input - The input string to be sanitized
 * @param {boolean} [stripTags=true] - A boolean indicating whether to strip HTML tags (default is true)
 * @return {string} The sanitized input string
 */
export const sanitize = (input, stripTags=true) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = input;
  if(stripTags) {
    return tmp.textContent || tmp.innerText || "";
  } else {
    return tmp.innerHTML;
  }
};

/**
 * Truncates a given string to a specified length, adding ellipsis if necessary.
 *
 * @param {string} str - The input string to be truncated
 * @param {number} length - The maximum length of the truncated string
 * @return {string} The truncated string
 */
export const truncate = (str, length) => {
  if (str.length > length) {
    const lastSpaceIndex = str.substr(0, length).lastIndexOf(" ");
    str =
      lastSpaceIndex !== -1
        ? str.substr(0, lastSpaceIndex) + "..."
        : str.substr(0, length) + "...";
  }
  return str;
};

/**
 * Toggles the specified attribute of the element selected by the given selector, and populates the element's component if it is visible.
 *
 * @param {string} selector - The CSS selector for the element to be selected.
 * @param {string} attribute - The name of the attribute to be toggled.
 */
export const toggleAndPopulate = (selector, attribute) => {
  const element = document.querySelector(selector);
  if (element && element.offsetParent !== null) {
    element.toggleAttribute(attribute);
    element.component.populate();
  }
};
