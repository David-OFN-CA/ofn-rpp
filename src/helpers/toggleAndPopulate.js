/**
 * Toggles the specified attribute of the element selected by the given selector, and populates the element's component if it is visible.
 *
 * @param {string} selector - The CSS selector for the element to be selected.
 * @param {string} attribute - The name of the attribute to be toggled.
 */
export default (selector, attribute) => {
  const element = document.querySelector(selector);
  if (element && element.offsetParent !== null) {
    element.toggleAttribute(attribute);
    element.component.populate();
  }
};
