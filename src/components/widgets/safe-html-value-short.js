import { LitElement, html, nothing } from "lit";
import { sanitize, truncate } from '@helpers/utils';

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
      if(!this.value) return nothing;
      return html`${truncate(sanitize(this.value), 125)}`;
    }
  }
);