import { LitElement, html, nothing } from "lit";

customElements.define(
  "custom-multiple-badge",
  class extends LitElement {
    static properties = {
      value: { attribute: "value" },
    };

    createRenderRoot() {
      return this;
    }

    render() {
      if (!this.value) {
        return nothing;
      }

      if (Array.isArray(this.value)) {
        return html`${this.value.map(
          (label) => html`<div class="chip">${label}</div>`,
        )}`;
      }
      return html`<div class="chip">${this.value}</div>`;
    }
  },
);
