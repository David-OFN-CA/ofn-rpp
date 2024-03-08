import { LitElement, html, nothing } from "lit";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Task } from "@lit/task";
import '~icons/mdi/file-document-check-outline';
import { importCore, CLIENT_CONTEXT, sanitize } from '@helpers/utils';

importCore().then(core => {
  // Custom widget for supporting evidence
  customElements.define(
    "custom-supporting-evidence",
    class extends LitElement {
      constructor() {
        super();
        this.filtering = [];
        this.currentProducer = "";
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

      _generateFilters(resources) {
        let filters = [];
        for(let resource of resources) {
          if(resource['@type'] == "ofn:supporting_evidence") {
            if(resource['ofn:Classification']) {
              for(let classification of resource['ofn:Classification']['ldp:contains']) {
                filters.push(classification['ofn:label']);
              }
            }
          } else if(resource["@type"] == "ofn:certification") {
            filters.push("Certifications");
          }
        };
        filters.sort();
        return Array.from(new Set(filters));
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if(!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          if(this.currentProducer != resource["@id"]) {
            this.filtering = [];
          }
          let supportingEvidence = await this._getProxyValue(await resource["ofn:hasSupportingEvidence"]);
          let certifications = await this._getProxyValue(await resource["ofn:hasCertifications"]);
          let resources = [...(supportingEvidence['ldp:contains'] || []), ...(certifications['ldp:contains'] || [])];
          let filters = this._generateFilters(resources);
          this.currentProducer = resource['@id'];
          return {
            resources: resources,
            filters: filters
          };
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

      toggle(e) {
        let target = e.target.getAttribute('value');
        if(target) {
          if(this.filtering.includes(target)) {
            this.filtering = this.filtering.filter(f => f != target);
          } else {
            this.filtering.push(target);
          }
          this.requestUpdate();
        }
        e.preventDefault();
      }

      navigateToMe(target=false) {
        this.filtering = target ? [target] : [];
        this.requestUpdate();
        this.parentElement.parentElement.parentElement.parentElement.parentElement.scrollIntoView();
      }

      render() {
        if(!this.dataSrc) return nothing;

        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (datas) => {
            this.rendering = html``;
            for(let res of datas.resources) {
              if(this.filtering.length > 0) {
                if(res['@type'] == "ofn:supporting_evidence") {
                  let c = [];
                  for(let classification of res['ofn:Classification']['ldp:contains']) {
                    if(!this.filtering.includes(classification['ofn:label'])) c.push(true);
                  }
                  if(c.length == res['ofn:Classification']['ldp:contains'].length) {
                    continue;
                  }
                } else if(res["@type"] == "ofn:certification") {
                  if(!this.filtering.includes("Certifications")) continue;
                }
              }
              let resourceRendering = [];
              if(res['@type'] == "ofn:supporting_evidence") {
                resourceRendering.push(html`
                  <div class="text-14 text-light-grey">${(new Date(res['ofn:Creation_date'])).toLocaleDateString()}</div>
                  <span class="text-18 bold text-black line-height-40 margin-right-10">${res['ofn:Title']}</span>
                `);

                  for(let classification of res['ofn:Classification']['ldp:contains']) {
                    resourceRendering.push(html`
                      <div class="chip white vertical-align-middle">${classification['ofn:label']}</div>
                    `);
                  }

                  if(res['ofn:service_provider_label']) {
                    if(res['ofn:service_provider_uri']) {
                      resourceRendering.push(html`
                        <div class="source truncate">Source <a class="source-text" href="${res['ofn:service_provider_uri']}" target="_blank">${res['ofn:service_provider_label']}</a></div>
                      `);
                    } else {
                      resourceRendering.push(html`
                        <div class="source truncate">Source <span class="source-text">${res['ofn:service_provider_label']}</span></div>
                      `);
                    }
                  }

                  if(res['ofn:Description']) {
                    resourceRendering.push(html`
                      <div>${unsafeHTML(sanitize(res['ofn:Description'], false))}</div>
                    `);
                  }
              } else if(res["@type"] == "ofn:certification") {
                resourceRendering.push(html`
                  <div class="text-14 text-light-grey">${(new Date(res['ofn:Creation_date'])).toLocaleDateString()}</div>
                  <span class="text-18 bold text-black line-height-40 margin-right-10">${res['ofn:Certification_status']}</span>
                  <div class="chip white vertical-align-middle">Certification</div>
                  <div class="row"><div class="col s12 m5">Expiry date: ${res['ofn:Expiry_date']}</div><div class="col s12 m5">Certification ID: ${res['ofn:Certification_ID']}</div></div>
                `);
              }

              if(res['ofn:Documentation_permissions']) {
                resourceRendering.push(html`
                  <div class="margin-top-20 document-availibility">${res['ofn:Documentation_permissions'].replace('Available on request', 'Documentation available upon direct request to producer')} <icon-mdi-file-document-check-outline></icon-mdi-file-document-check-outline></div>
                `);
              }

              this._addToRender(html`
                <div class="card-panel card-evidence">
                  ${resourceRendering}
                </div>
              `);
            }

            let filtersRendering = [];
            for(let filter of datas.filters) {
              filtersRendering.push(html`
              <div>
                <label>
                  <input type="checkbox" ?checked="${this.filtering.includes(filter)}"> <span @click="${this.toggle}" value="${filter}">${filter}</span>
                </label>
              </div>
              `);
            }

            return html`
              <div class="col s12 m3">
                <h6 class="margin-top-50">Filters</h6>
                <div class="flex-column">
                  ${filtersRendering}
                </div>
              </div>
              <div class="col s12 m8">
                ${this.rendering}
              </div>`;
          },
          error: (e) => html`<p>Error while loading supporting evidence informations.</p>`
        });
      }
    }
  );
});
