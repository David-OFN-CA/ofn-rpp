import { LitElement, html, nothing } from "lit";

customElements.define(
  "custom-display-image",
  class extends LitElement {
    constructor() {
      super();
    }
    static properties = {
      value: { attribute: "value" },
    };
    createRenderRoot() {
      return this;
    }
    render() {
      return html`${this.value.length > 0
        ? html`<div class="background-img" style="background-image:url(${this.value})"></div>`
        : nothing}`;
    }
  }
);
