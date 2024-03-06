import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import { importCore, CLIENT_CONTEXT } from '@helpers/utils';

importCore().then(core => {
  customElements.define(
    "custom-supporting-evidence-counter",
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
        let response = {};
        let properties = await resource['properties'];
        if(resource["@type"] == "dfc-b:Enterprise") {
          properties = ["ofn:hasSupportingEvidence"];
        }
        for(let property of properties)  {
          let value = resource[property];
          if(value !== null) {
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
                if(!Array.isArray(value)) {
                  value = [value];
                }
                let expandedContainer = [];
                for(let entry of value) {
                  if(entry !== null) {
                    // Grab the whole nested datas from the store using the clientContext
                    entry = await core.store.getData(entry["@id"], resource['clientContext']);
                    expandedContainer.push(await this._getProxyValue(entry));
                  }
                }
                // Rewrite the ldp:contains with a complete one
                value = expandedContainer;
              } catch (e) {
                if(import.meta.env.DEV) console.error(e);
              }
            }
            response[property] = value;
          }
        }
        return response;
      }

      async _formatResource(resource) {
        let supportingEvidences = resource["ofn:hasSupportingEvidence"],
            response = [];
        if(supportingEvidences["ldp:contains"] === null) {
          return false;
        }
        // Bug core? When ldp:contains have only one entry, it is not an array
        if(!Array.isArray(supportingEvidences["ldp:contains"])) {
          supportingEvidences = [supportingEvidences["ldp:contains"]];
        } else {
          supportingEvidences = supportingEvidences["ldp:contains"];
        }
        for(let evidence of supportingEvidences) {
          let classifications = evidence["ofn:Classification"];
          if(classifications["ldp:contains"] !== null) {
            // Bug core? When ldp:contains have only one entry, it is not an array
            if(!Array.isArray(classifications["ldp:contains"])) {
              classifications = [classifications["ldp:contains"]];
            } else {
              classifications = classifications["ldp:contains"];
            }
            for(let classification of classifications) {
              classification = classification["ofn:label"];
              let counter = response.find(o => o.name === classification);
              if (counter) {
                counter.counter++;
              } else {
                response.push({ name: classification, counter: 1 });
              }
            }
          }
        }
        return response;
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if(!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = await this._getProxyValue(resource);
          return this._formatResource(response);
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

      navigate(e) {
        let target = e.target.getAttribute('target');
        if(target) {
          let targetElement = document.querySelector('custom-supporting-evidence');
          targetElement.filtering = [target];
          targetElement.requestUpdate();
          targetElement.parentElement.parentElement.parentElement.parentElement.parentElement.scrollIntoView();
        }
      }

      render() {
        if(!this.dataSrc) nothing;

        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            this.rendering = html``;
            if(resource) {
              for(let classification of resource) {
                this._addToRender(html`
                  <div class="row no-margin-bottom">
                    <div class="col s12">
                      <div class="chip small text-12 bg-green-pea">${classification.counter}</div>
                      <span class="text-14 text-green-pea">
                        for
                        <a @click="${this.navigate}" target="${classification.name}" class="underline cursor-pointer text-green-pea">${classification.name}</a></span>
                    </div>
                  </div>
                `);
              }
            } else {
              return nothing;
            }

            return html`
              ${this.rendering}
            `;
          },
          error: (e) => html`<p>Error while loading supporting evidence counter.</p>`
        });
      }
    }
  );
});
