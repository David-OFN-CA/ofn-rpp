import { LitElement, html } from "lit";
import { assetPath, toggleAndPopulate } from '@helpers/utils';

// Custom widget for filtering First Nations Led
customElements.define(
  "custom-search-firstnationsled",
  class extends LitElement {
    constructor() {
      super();
      this.checkbox = false;
    }
    static properties = {
      value: { attribute: "value" },
      checkbox: { type: Boolean, attribute: false },
    };
    createRenderRoot() {
      return this;
    }
    blocked = false;
    toggle(changed=true) {
      if(!this.blocked) {
        this.blocked = true;
        if(changed) this.checkbox = !this.checkbox;
        setTimeout(() => {
          toggleAndPopulate(`[filtered-by=producers-list-filters-${this.value}]`, "required-ofn:first_nations_country", 'ofn:First_Nations_country');
          toggleAndPopulate(`[filtered-by=products-list-filters-${this.value}]`, "required-dfc-b:suppliedBy.ofn:First_Nations_country", 'ofn:dfc-b:suppliedBy.First_Nations_country');
          this.blocked = false;
        }, 0);
      }
    }

    render() {
      if(this.checkbox) {
        this.toggle(false);
      }
      return html`<div class="switch">
        <label style="background-image: url(${assetPath('/Australian_Aboriginal_Flag.png')});" class="padding-15 cursor-pointer" @click="${this.toggle}">
          First Nations Led
          <input
            type="checkbox"
            .value="${this.checkbox}"
          />
          <span class="lever"></span>
        </label>
      </div>`;
    }
  }
);
