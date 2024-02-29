import { LitElement, html } from "lit";
import { toggleAndPopulate } from '@helpers/utils';

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
    blocked = false;
    toggle() {
      if(!this.blocked) {
        this.blocked = true;
        let target = "required-ofn:first_nations_country";
        setTimeout(() => {
          toggleAndPopulate(`[filtered-by=producers-list-filters-${this.value}]`, target);
          toggleAndPopulate(`[filtered-by=products-list-filters-${this.value}]`, target);
          this.blocked = false;
        }, 0);
      }
    }
    render() {
      return html`<div class="switch">
        <label class="padding-15 cursor-pointer" @click="${this.toggle}">
          First Nations Led
          <input
            type="checkbox"
          />
          <span class="lever"></span>
        </label>
      </div>`;
    }
  }
);
