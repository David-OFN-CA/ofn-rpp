import { LitElement, html } from "lit";
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
      return html`${truncate(sanitize(this.value), 125)}`;
    }
  }
);