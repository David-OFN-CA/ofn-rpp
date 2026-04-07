import { LitElement, nothing } from "lit";
import { Task } from "@lit/task";
import { CLIENT_CONTEXT } from "@helpers/utils";
import { html, literal, unsafeStatic } from "lit/static-html.js";

customElements.define(
  "custom-social-links",
  class extends LitElement {
    constructor() {
      super();
    }

    static properties = {
      dataSrc: { attribute: "data-src" },
    };

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
      for (let social of await resource["ldp:contains"]) {
        const name = await social["dfc-b:name"];
        let link = await social["dfc-b:URL"];
        if (!/^https?:\/\//i.test(link)) {
          link = "https://" + link;
        }
        response.push({
          "dfc-b:name": name,
          "dfc-b:URL": link,
          app: name.replace("_phone", ""),
        });
      }
      return response;
    }

    _getResource = new Task(this, {
      task: async ([dataSrc]) => {
        if (!dataSrc) return;
        const resource = await window.sibStore.getData(dataSrc, CLIENT_CONTEXT);
        let response = await this._getProxyValue(resource);
        return response;
      },
      args: () => [this.dataSrc],
    });

    _addToRender(template) {
      if (!this.rendering) this.rendering = html``;
      this.rendering = html`${this.rendering}${template}`;
    }

    _renderSocial(social) {
      const app = literal`icon-mdi-${unsafeStatic(social["app"])}`;
      return html`<div class="col"><a class="social-link" href="${
        social["dfc-b:URL"]
      }" target="_blank" title="${social["dfc-b:name"]}"><${app} class="icon"></${app}></a></div>`;
    }

    render() {
      if (!this.dataSrc) return nothing;
      return this._getResource.render({
        pending: () =>
          html`<div class="progress"><div class="indeterminate"></div></div>`,
        complete: (resource) => {
          if (resource) {
            return html`<div class="row">
              <div class="col s12">${resource.map(this._renderSocial)}</div>
            </div>`;
          }
          return nothing;
        },
        error: (_e) => nothing,
      });
    }
  },
);
