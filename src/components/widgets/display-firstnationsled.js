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
    render() {
      return html`${this.value.length > 0
        ? html`<div class="col s12 text-14 bold">First Nations Led</div><div class="col s12 text-14">${this.value}</div>`
        : ""}`;
    }
  }
);
