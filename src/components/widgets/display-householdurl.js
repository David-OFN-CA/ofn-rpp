import { LitElement, html } from "lit";

customElements.define(
  "custom-display-householdurl",
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
        ? html` <div class="row no-margin-bottom valign-wrapper">
            <span class="col s12 text-link">
              <a href="${this.value}" target="_blank"
                >Producer website</a>
            </span>
          </div>`
        : ""}`;
    }
  }
);
