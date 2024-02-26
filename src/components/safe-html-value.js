import { LitElement, html } from "lit";

import("../utils.js").then((utils) => {
  // Custom widget for producer description, original contains some unsafe html
  customElements.define(
    "custom-safe-html-value",
    class extends LitElement {
      constructor() {
        super();
      }
      static properties = {
        value: { attribute: "value" },
      };
      render() {
        return html`${utils.sanitize(this.value, false)}`;
      }
    }
  );
});
