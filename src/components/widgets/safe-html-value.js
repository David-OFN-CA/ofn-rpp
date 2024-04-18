import { LitElement, html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { sanitize } from "@helpers/utils";

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
      if (!this.value) return nothing;
      return html`${unsafeHTML(sanitize(this.value, false))}`;
    }
  }
);
