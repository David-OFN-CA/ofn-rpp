import { LitElement, css, html } from "lit";
import { assetPath } from "@helpers/utils";

customElements.define(
  "custom-badge-firstnationsled",
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
        background-color: transparent;
        border: 1px solid #191c1d;
        color: #191c1d;
        border-radius: 41px;
        text-transform: uppercase;
        padding: 4px;
        padding-right: 12px;
        margin-right: 6px;
        margin-bottom: 6px;
        padding-left: 12px;
      }
    `;
    render() {
      return html`${this.value.length > 0
        ? html`<div>Indigenous Led</div>`
        : ""}`;
    }
  }
);
