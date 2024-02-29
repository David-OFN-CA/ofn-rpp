import { LitElement, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitize } from '@helpers/utils';

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
      return html`${unsafeHTML(sanitize(this.value, false))}`;
    }
  }
);
