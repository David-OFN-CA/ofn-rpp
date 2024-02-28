import { LitElement, html } from "lit";
import { Task } from "@lit/task";

import("@helpers/utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    // Custom widget for wholesale
    customElements.define(
      "conditional-display",
      class extends LitElement {
        constructor() {
          super();
        }

        static properties = {
          dataSrc: { attribute: "data-src" },
          condition: { attribute: "condition" },
        }

        /**
         * Check if a resource exists or if a container isn't empty
         *
         * @param {Object} resource - The resource to retrieve the property value from
         * @param {string} property - The property to retrieve the value for
         * @return {boolean} Whether the property value is a proxy value or not
         */
        async _getProxyValue(resource, property) {
          let response = await resource[property];
          if(response && typeof response === "object" && "getProxy" in response) {
            if((await response['properties']).includes("ldp:contains")) {
              let container = await response.get("ldp:contains");
              if(container === null) {
                return false;
              }
              return container.length > 0;
            } else {
              return true;
            }
          }
          return !!response;
        }

        _getResource = new Task(this, {
          task: async ([dataSrc, property]) => {
            if(!dataSrc) return;
            const resource = await core.store.getData(dataSrc, utils.CLIENT_CONTEXT);
            let response = await this._getProxyValue(resource, property);
            return response;
          },
          args: () => [this.dataSrc, this.condition]
        })

        render() {
          if(!this.dataSrc || !this.condition) return html``;

          return this._getResource.render({
            pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
            complete: (resource) => {
              if(resource) {
                return html`<slot></slot>`;
              }
              return html``;
            },
            error: (e) => html`<p>Error while loading condition.</p>`
          });
        }
      }
    );
  });
});
