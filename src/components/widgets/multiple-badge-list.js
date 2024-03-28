import { LitElement, css, html } from "lit";

customElements.define(
  "custom-multiple-badge-list",
  class extends LitElement {
    constructor() {
      super();
    }
    static properties = {
      value: { attribute: "value" },
    };
    static styles = css`
      div {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        height: auto;
        text-align: left;
        background-color: white;
        border: 1px solid black;
        color: #191c1d;
        border-radius: 41px;
        text-transform: uppercase;
        padding: 4px;
        padding-left: 12px;
        padding-right: 12px;
        margin-right: 6px;
        margin-bottom: 6px;
      }
    `;
    render() {
      const badges = JSON.parse(this.value);
      return html`${badges.map((chip) =>
        chip.length > 0 ? html`<div>${chip}</div>` : ""
      )}`;
    }
  }
);
