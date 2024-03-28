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
        background-color: #ede7e2;
        color: #191c1d;
        border-radius: 41px;
        text-transform: uppercase;
        padding: 4px;
        padding-right: 12px;
        margin-right: 6px;
        margin-bottom: 6px;
        background-repeat: no-repeat;
        background-size: 25px 15px;
        padding-left: 50px;
        background-position: 12px;
      }
    `;
    render() {
      return html`${this.value.length > 0
        ? html`<div style="background-image: url(${assetPath('/Australian_Aboriginal_Flag.png')});">First Nations Led</div>`
        : ""}`;
    }
  }
);
