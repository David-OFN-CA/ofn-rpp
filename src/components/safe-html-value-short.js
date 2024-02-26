import { LitElement, html } from "lit";

import("../utils.js").then((utils) => {
  // Custom widget for producer description, original contains some unsafe html, truncated
  customElements.define(
    "custom-safe-html-value-short",
    class extends LitElement {
      constructor() {
        super();
      }
      static properties = {
        value: { attribute: "value" },
      };
      render() {
        return html`${utils.truncate(utils.sanitize(this.value), 125)}`;
      }
    }
  );
});