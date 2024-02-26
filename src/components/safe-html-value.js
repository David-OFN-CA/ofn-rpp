import { LitElement, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

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
        return html`${unsafeHTML(utils.sanitize(this.value, false))}`;
      }
    }
  );
});
