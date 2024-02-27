import { LitElement, html } from "lit";

import("@helpers/utils.js").then((utils) => {
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