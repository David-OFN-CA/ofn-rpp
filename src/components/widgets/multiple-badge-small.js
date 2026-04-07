import { LitElement, html, nothing } from "lit";

customElements.define(
  "custom-multiple-badge-small",
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
          (label) => html`<div class="chip small">${label}</div>`,
        )}`;
      }
      return html`<div class="chip small">${this.value}</div>`;
    }
  },
);
