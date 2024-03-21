import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import { importCore, CLIENT_CONTEXT, uniq } from '@helpers/utils';

importCore().then(core => {
  customElements.define(
    "custom-assurance-partner",
    class extends LitElement {
      constructor() {
        super();
      }

      static properties = {
        dataSrc: { attribute: "data-src" },
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
        let response = [];
        for(let partner of await resource['ldp:contains']) {
          response.push({
            "ofn:Group_name": await partner["ofn:Group_name"],
            "ofn:Logo_URL": await partner["ofn:Logo_URL"],
          });
        }
        return response;
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if(!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = await this._getProxyValue(resource);
          return response;
        },
        args: () => [this.dataSrc]
      })

      _addToRender(template) {
        if(!this.rendering) this.rendering = html``;
        this.rendering = html`${this.rendering}${template}`;
      }

      render() {
        if(!this.dataSrc) return nothing;
        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            if(resource) {
              this.rendering = html``;
              for(let partner of resource) {
                this._addToRender(html`
                  <div class="col s6">
                    <img class="responsive-img" src="${partner["ofn:Logo_URL"]}" alt="${partner["ofn:Group_name"]}" />
                    <br />
                    <span class="text-14 text-green bold underline">${partner["ofn:Group_name"]}</span>
                  </div>
                `);
              }
              return html`
                <div>
                  ${this.rendering}
                </div>
              `;
            }
            return nothing;
          },
          error: (e) => html`<p>Error while loading contact form.</p>`
        });
      }
    }
  );
});
