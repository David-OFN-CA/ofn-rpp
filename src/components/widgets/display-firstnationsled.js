import { LitElement, html } from "lit";

customElements.define(
  "custom-display-firstnationsled",
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
        ? html`<div class="row">
            <div class="col s12 text-14 bold">First Nations Country</div>
            <div class="col s12 text-14">${this.value}</div>
          </div>`
        : ""}`;
    }
  }
);
