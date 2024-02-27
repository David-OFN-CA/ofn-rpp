import { LitElement, html } from "lit";

import("@helpers/utils.js").then((utils) => {
  // Custom widget for filtering First Nations Led
  customElements.define(
    "custom-search-firstnationsled",
    class extends LitElement {
      constructor() {
        super();
      }
      static properties = {
        value: { attribute: "value" },
        checkbox: { type: Boolean },
      };
      createRenderRoot() {
        return this;
      }
      toggle() {
        let target = "required-ofn:first_nations_country";
        setTimeout(() => {
          utils.toggleAndPopulate(`[filtered-by=producers-list-filters-${this.value}]`, target);
          utils.toggleAndPopulate(`[filtered-by=products-list-filters-${this.value}]`, target);
        }, 0);
      }
      render() {
        return html`<div class="switch">
          <label>
            First Nations Led
            <input
              type="checkbox"
            />
            <span class="lever" @click="${this.toggle}"></span>
          </label>
        </div>`;
      }
    }
  );
});
