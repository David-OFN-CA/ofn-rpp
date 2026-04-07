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

      let val = this.value;
      if (typeof val === "string" && /^\[.*\]$/.test(val.trim())) {
        try { val = JSON.parse(val); } catch {}
      }

      if (Array.isArray(val)) {
        return html`${val.map(
          (label) => html`<div class="chip">${label}</div>`,
        )}`;
      }
      return html`<div class="chip small">${val}</div>`;
    }
  },
);
