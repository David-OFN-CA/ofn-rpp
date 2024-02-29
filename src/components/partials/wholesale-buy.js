import { LitElement, html } from "lit";
import { Task } from "@lit/task";
import "~icons/mdi/phone-in-talk";
import "~icons/mdi/open-in-new";
import { importCore, CLIENT_CONTEXT, uniq } from '@helpers/utils';

importCore().then(core => {
  // Custom widget for wholesale
  customElements.define(
    "custom-wholesale-buy",
    class extends LitElement {
      constructor() {
        super();
      }

      static properties = {
        dataSrc: { attribute: "data-src" },
        uniq: { attribute: "uniq" },
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
          response[property] = value;
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

      /**
       * Helper function that adds the given template to the current rendering.
       *
       * @param {html} template - the template to be added to the rendering
       */
      _addToRender(template) {
        if(!this.rendering) this.rendering = html``;
        this.rendering = html`${this.rendering}${template}`;
      }

      /**
       * Helper function that return the whole state of the rendering
       *
       * @return {html} Provide the current template
       */
      _render() {
        return this.rendering;
      }

      render() {
        if(!this.dataSrc) return html``;
        if(!this.uniq) this.uniq = uniq();

        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            this.rendering = html``;
            if(resource["ofn:Wholesale_buy_description"]) {
              this._addToRender(html`
                <div class="row">
                  <div class="col s12 text-14 text-light">
                    ${resource["ofn:Wholesale_buy_description"]}
                  </div>
                </div>
              `);
            }
            if(resource["ofn:Wholesale_enquiry_preferences"]) {
              if(resource["ofn:Wholesale_enquiry_preferences"].includes("Email") && resource["ofn:Wholesale_enquiry_preferences"].includes("Phone")) {
                this._addToRender(html`
                  <div class="row">
                    <div class="col s12">
                      <a
                        href="#${this.uniq}-contact-producer"
                        class="waves-effect waves-light btn-small"
                      >View contact details</a>
                    </div>
                  </div>
                `);
              } else if(resource["ofn:Wholesale_enquiry_preferences"].includes("Phone")) {
                this._addToRender(html`
                  <div class="row text-light no-margin-bottom">
                    <div class="col s12">Phone number</div>
                  </div>
                  <div class="row text-link valign-wrapper">
                    <div class="col s8 truncate">${resource["dfc-b:hasPhoneNumber"]}</div>
                    <div class="col s4">
                      <icon-mdi-phone-in-talk></icon-mdi-phone-in-talk>
                    </div>
                  </div>
                `);
              }
              // if(resource["ofn:Wholesale_enquiry_preferences"].includes("Email")) {
              //   this._addToRender(html`
              //     <div class="row text-light no-margin-bottom">
              //       <div class="col s12">Email address</div>
              //     </div>
              //     <div class="row text-link valign-wrapper">
              //       <div class="col s8 truncate">${resource["dfc-b:email"]}</div>
              //       <div class="col s4">
              //         <icon-mdi-email-outline></icon-mdi-email-outline>
              //       </div>
              //     </div>
              //   `);
              // }

              if(resource["ofn:Wholesale_enquiry_preferences"].includes("Direct online purchase")) {
                if(resource["ofn:Wholesale_URL_1"] && resource["ofn:Wholesale_URL_1_label"]) {
                  this._addToRender(html`
                    <div class="row text-light no-margin-bottom">
                      <div class="col s12">${resource["ofn:Wholesale_URL_1_label"]}</div>
                    </div>
                    <div class="row valign-wrapper">
                      <div class="col s12">
                        <a href="${resource["ofn:Wholesale_URL_1"]}" target="_blank" class="text-link text-link-red">
                          Visit website&nbsp;<icon-mdi-open-in-new style="font-size: 18px;"></icon-mdi-open-in-new>
                        </a>
                      </div>
                    </div>
                  `);
                }
                if(resource["ofn:Wholesale_URL_2"] && resource["ofn:Wholesale_URL_2_label"]) {
                  this._addToRender(html`
                    <div class="row text-light no-margin-bottom">
                      <div class="col s12">${resource["ofn:Wholesale_URL_2_label"]}</div>
                    </div>
                    <div class="row valign-wrapper">
                      <div class="col s12">
                        <a href="${resource["ofn:Wholesale_URL_2"]}" target="_blank" class="text-link text-link-red">
                          Visit website&nbsp;<icon-mdi-open-in-new style="font-size: 18px;"></icon-mdi-open-in-new>
                        </a>
                      </div>
                    </div>
                  `);
                }
                if(resource["ofn:Wholesale_URL_3"] && resource["ofn:Wholesale_URL_3_label"]) {
                  this._addToRender(html`
                    <div class="row text-light no-margin-bottom">
                      <div class="col s12">${resource["ofn:Wholesale_URL_3_label"]}</div>
                    </div>
                    <div class="row valign-wrapper">
                      <div class="col s12">
                        <a href="${resource["ofn:Wholesale_URL_3"]}" target="_blank" class="text-link text-link-red">
                          Visit website&nbsp;<icon-mdi-open-in-new style="font-size: 18px;"></icon-mdi-open-in-new>
                        </a>
                      </div>
                    </div>
                  `);
                }
              }
            }

            if(resource["ofn:Selling_to_household"]) {
              this._addToRender(html`
                <h6 class="margin-top-50">Household customers</h6>
                <div class="row text-light no-margin-bottom">
                    <div class="col s12">${resource["ofn:Household_buy_label"]}</div>
                </div>
                <div class="row text-link valign-wrapper">
                  <div class="col s12">
                    <a href="${resource["ofn:Household_URL"]}" target="_blank" class="text-link text-link-red">
                      Visit website&nbsp;<icon-mdi-open-in-new style="font-size: 18px;"></icon-mdi-open-in-new>
                    </a>
                  </div>
                </div>
              `);
            }

            return this._render();
          },
          error: (e) => html`<p>Error while loading wholesale informations.</p>`
        });
      }
    }
  );
});
