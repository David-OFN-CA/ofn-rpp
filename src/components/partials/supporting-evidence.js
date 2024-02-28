import { LitElement, html } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Task } from "@lit/task";
import '~icons/mdi/file-document-check-outline';

import("@helpers/utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    // Custom widget for supporting evidence
    customElements.define(
      "custom-supporting-evidence",
      class extends LitElement {
        constructor() {
          super();
        }

        static properties = {
          dataSrc: { attribute: "value" },
        }

        createRenderRoot() {
          return this;
        }

        /**
         * Asynchronously gets the proxy value for the given resource.
         *
         * @param {proxy} resource - description of resource
         * @return {object} response containing the serialized resource
         */
        async _getProxyValue(resource) {
          let response = {};
          for(let property of await resource['properties'])  {
            let value = resource[property];
            if(!property.startsWith('@')) {
              value = await resource.get(property);
              try {
                if(value && typeof value === "object" && "getProxy" in value) {
                  value = await this._getProxyValue(value);
                }
              } catch (e) {
                if(import.meta.env.DEV) console.error(e);
              }
            }
            if(property == "ldp:contains") {
              try {
                // Bug core? When ldp:contains have only one entry, it is not an array
                if(!Array.isArray(value) && value !== null) {
                  value = [value];
                }
                let expandedContainer = [];
                for(let entry of value) {
                  // Grab the whole nested datas from the store using the clientContext
                  entry = await core.store.getData(entry["@id"], resource['clientContext']);
                  expandedContainer.push(await this._getProxyValue(entry));
                }
                // Rewrite the ldp:contains with a complete one
                value = expandedContainer;
              } catch (e) {
                if(import.meta.env.DEV) console.error(e);
              }
            }
            response[property] = value;
          }
          return response;
        }

        _getResource = new Task(this, {
          task: async ([dataSrc]) => {
            if(!dataSrc) return;
            const resource = await core.store.getData(dataSrc, utils.CLIENT_CONTEXT);
            let response = await this._getProxyValue(resource);
            return response;
          },
          args: () => [this.dataSrc]
        })

        /**
         * Helper function that adds the given template to the current rendering.
         *
         * @param {html} template - the template to be added to the rendering
         */
        _addToRender(template) {
          if(!this.rendering) this.rendering = html``;
          this.rendering = html`${this.rendering}${template}`;
        }

        render() {
          if(!this.dataSrc) return html``;

          return this._getResource.render({
            pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
            complete: (resource) => {
              this.rendering = html``;

              this._addToRender(html`
                <div class="text-14 text-light-grey">${resource['ofn:Creation_date']}</div>
                <span class="text-18 bold text-black line-height-40 margin-right-10">${resource['ofn:Title']}</span>
              `);

              for(let classification of resource['ofn:Classification']['ldp:contains']) {
                this._addToRender(html`
                  <div class="chip white vertical-align-middle">${classification['ofn:label']}</div>
                `);
              }

              this._addToRender(html`
                <!-- <div>Source ${resource['ofn:???']}</div> -->
                <div>${unsafeHTML(utils.sanitize(resource['ofn:Description'], false))}</div>
              `);

              if(resource['ofn:Documentation_permissions']) {
                this._addToRender(html`
                  <div class="margin-top-20 document-availibility">${resource['ofn:Documentation_permissions'].replace('Available on request', 'Documentation available upon direct request to producer')} <icon-mdi-file-document-check-outline></icon-mdi-file-document-check-outline></div>
                `);
              }

              return html`
                <div class="card-panel card-evidence">
                  ${this.rendering}
                </div>
              `;
            },
            error: (e) => html`<p>Error while loading supporting evidence informations.</p>`
          });
        }
      }
    );
  });
});
